from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    goal: Optional[str] = None
    activity_level: Optional[str] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    profile_pic: Optional[str] = None
    health_conditions: Optional[str] = None
    sleep_hours: Optional[str] = None
    stress_level: Optional[int] = None
    dislikes: Optional[str] = None
    meals_per_day: Optional[str] = None
    water_intake: Optional[str] = None

class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: str
    full_name: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    goal: Optional[str] = None
    activity_level: Optional[str] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True