from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from app.database import db
app = FastAPI()


# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

