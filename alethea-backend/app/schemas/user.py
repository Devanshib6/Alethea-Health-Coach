from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"  # Add this line

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    goal: Optional[str] = None
    activity_level: Optional[str] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None

class UserResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str
    role: str
    is_active: bool
    age: Optional[int] = None
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