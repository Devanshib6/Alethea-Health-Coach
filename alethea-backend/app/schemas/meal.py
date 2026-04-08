from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MealCreate(BaseModel):
    meal_name: str
    meal_type: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fats: Optional[float] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None

class MealResponse(BaseModel):
    id: int
    user_id: int
    meal_name: str
    meal_type: str
    calories: Optional[float]
    protein: Optional[float]
    carbs: Optional[float]
    fats: Optional[float]
    logged_at: datetime

    class Config:
        from_attributes = True