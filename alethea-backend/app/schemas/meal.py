from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
import uuid

class MealCreate(BaseModel):
    food_name: str
    meal_type: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None

class MealResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    food_name: str
    meal_type: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True