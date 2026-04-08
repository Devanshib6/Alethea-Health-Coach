from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

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
    id: str
    user_id: str
    food_name: str
    meal_type: str
    calories: Optional[float]
    protein: Optional[float]
    carbs: Optional[float]
    fat: Optional[float]
    quantity: Optional[float]
    unit: Optional[str]
    date: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True