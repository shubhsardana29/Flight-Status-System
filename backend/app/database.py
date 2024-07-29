import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")

if not MONGO_CONNECTION_STRING:
    logging.error("MongoDB connection string is not set. Check your .env file.")
    raise ValueError("MongoDB connection string is not set")


try:
    client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
    db = client["flight_status"]
    logging.info("Connected to MongoDB successfully")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")
    raise e
