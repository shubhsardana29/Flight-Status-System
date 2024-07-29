from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import timedelta
from typing import List
from app.database import db
from app.notification import send_notification
from app.auth import (
    verify_password, get_password_hash, create_access_token,
    SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.models import User, FlightStatus
import logging
from bson import ObjectId

# Initialize router and OAuth2 scheme
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Connection manager for handling WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# WebSocket endpoint for real-time communication
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Endpoint to register a new user
@router.post("/register/")
async def register(user: User):
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    try:
        if await db["users"].find_one({"username": user.username}):
            raise HTTPException(status_code=400, detail="Username already registered")
        await db["users"].insert_one(user_dict)
        logging.info(f"User registered: {user.username}")
        return {"message": "User registered successfully"}
    except Exception as e:
        logging.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint for user login
@router.post("/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db["users"].find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Dependency to get the current user from the token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        user = await db["users"].find_one({"username": username})
        if user is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Endpoint to add or update flight status
@router.post("/status/")
async def add_flight_status(flight_status: FlightStatus, current_user: User = Depends(get_current_user)):
    try:
        existing_flight = await db["flights"].find_one({"flight_id": flight_status.flight_id})
        if existing_flight:
            await db["flights"].update_one({"flight_id": flight_status.flight_id}, {"$set": flight_status.dict()})
            logging.info(f"Flight status updated: {flight_status.flight_id}")
        else:
            await db["flights"].insert_one(flight_status.dict())
            logging.info(f"Flight status added: {flight_status.flight_id}")

        updated_flight = await db["flights"].find_one({"flight_id": flight_status.flight_id})
        await send_notification(flight_status)

        if updated_flight:
            updated_flight["_id"] = str(updated_flight["_id"])  # Convert ObjectId to string
            await manager.broadcast(f"Flight {updated_flight['flight_id']} status updated")
            return updated_flight

        return {"message": "Flight status added successfully"}
    except Exception as e:
        logging.error(f"Error adding flight status: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint to get the status of a specific flight
@router.get("/status/{flight_id}")
async def get_flight_status(flight_id: str, current_user: User = Depends(get_current_user)):
    try:
        flight = await db["flights"].find_one({"flight_id": flight_id})
        if flight:
            flight["_id"] = str(flight["_id"])  # Convert ObjectId to string
            flight.pop("_id", None)
            return flight
        else:
            raise HTTPException(status_code=404, detail="Flight not found")
    except Exception as e:
        logging.error(f"Error fetching flight status: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint to get all available flights info
@router.get("/flights/")
async def get_all_flights(current_user: User = Depends(get_current_user)):
    try:
        flights = await db["flights"].find().to_list(length=None)
        for flight in flights:
            flight["_id"] = str(flight["_id"])  # Convert ObjectId to string
        return flights
    except Exception as e:
        logging.error(f"Error fetching flights: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
