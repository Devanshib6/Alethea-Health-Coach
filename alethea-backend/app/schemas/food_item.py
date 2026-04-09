from pydantic import BaseModel
from typing import Optional
import uuid

class FoodItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fats_per_100g: Optional[float] = None
    fiber_per_100g: Optional[float] = None

class FoodItemResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: Optional[str] = None
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fats_per_100g: Optional[float] = None
    fiber_per_100g: Optional[float] = None

    class Config:
        from_attributes = True