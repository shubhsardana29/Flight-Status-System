from pydantic import BaseModel, Field
from typing import Optional

class FlightStatus(BaseModel):
    flight_id: str
    status: str
    gate: Optional[str]
    delay: Optional[int]

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^\S+@\S+\.\S+$')
    password: str = Field(..., min_length=6)
