import asyncio
import logging
from app.database import db  # Import the 'db' object from 'database.py'
from app.models import FlightStatus, User

# Configure logging
logging.basicConfig(level=logging.INFO)

async def insert_dummy_data():
    try:
        # Create a collection reference
        flights_collection = db["flights"]
        
        # Dummy flight status data
        flight_data = [
            FlightStatus(flight_id="AA123", status="On Time", gate="A12", delay=None).dict(),
            FlightStatus(flight_id="BB456", status="Delayed", gate="B23", delay=30).dict(),
            FlightStatus(flight_id="CC789", status="Cancelled", gate=None, delay=None).dict()
        ]
        
        # Insert dummy data into the collections
        result_flights = await flights_collection.insert_many(flight_data)
        
        # Log the result
        logging.info(f"Inserted flight data with IDs: {result_flights.inserted_ids}")


    except Exception as e:
        logging.error(f"Error inserting dummy data: {e}")

# Run the async function
if __name__ == "__main__":
    asyncio.run(insert_dummy_data())
