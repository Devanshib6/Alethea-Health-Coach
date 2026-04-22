from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import base64
import uuid

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.food_database import FoodDatabase
from app.services.food_recognition_service import FoodRecognitionService

router = APIRouter()

class FoodRecognitionRequest(BaseModel):
    image_base64: str

class FoodItemResponse(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = 0
    confidence: Optional[int] = 0

@router.post("/recognize")
async def recognize_food(
    request: FoodRecognitionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Recognize food from base64 image and return nutrition information
    """
    try:
        recognition_service = FoodRecognitionService()
        results = recognition_service.recognize_food_from_image(request.image_base64, db)
        
        return {
            "success": True,
            "detected_foods": results,
            "message": "Food detected successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition failed: {str(e)}")

@router.get("/search")
def search_food(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for food by name in database"""
    foods = db.query(FoodDatabase).filter(
        FoodDatabase.food_name.ilike(f"%{query}%")
    ).limit(10).all()
    
    return {
        "success": True,
        "results": [{
            "food_name": f.food_name,
            "calories": f.calories_per_100g,
            "protein": f.protein_per_100g,
            "carbs": f.carbs_per_100g,
            "fat": f.fat_per_100g,
            "fiber": f.fiber_g,
            "meal_type": f.meal_type,
            "diet_type": f.diet_type
        } for f in foods]
    }