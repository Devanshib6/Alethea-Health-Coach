from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.models.user import User
from app.models.food_database import FoodDatabase
from app.core.database import get_db
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

class FoodItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    meal_type: Optional[str] = None
    diet_type: Optional[str] = None
    cuisine: Optional[str] = None
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fat_per_100g: Optional[float] = None
    fiber_g: Optional[float] = None


@router.get("/search")
def search_food(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(FoodDatabase).filter(
        FoodDatabase.food_name.ilike(f'%{query}%')
    ).limit(limit).all()
    
    return {
        "success": True, 
        "query": query, 
        "count": len(results), 
        "results": [{
            "food_name": r.food_name,
            "category": r.category,
            "meal_type": r.meal_type,
            "diet_type": r.diet_type,
            "cuisine": r.cuisine,
            "calories": r.calories_per_100g,
            "protein": r.protein_per_100g,
            "carbs": r.carbs_per_100g,
            "fat": r.fat_per_100g,
            "fiber": r.fiber_g
        } for r in results]
    }


@router.post("/add")
def add_food_item(
    data: FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    
    existing = db.query(FoodDatabase).filter(
        FoodDatabase.food_name.ilike(data.name)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Food item already exists")
    
    food = FoodDatabase(
        id=uuid.uuid4(),
        food_name=data.name,
        category=data.category,
        meal_type=data.meal_type,
        diet_type=data.diet_type,
        cuisine=data.cuisine,
        calories_per_100g=data.calories_per_100g,
        protein_per_100g=data.protein_per_100g,
        carbs_per_100g=data.carbs_per_100g,
        fat_per_100g=data.fat_per_100g,
        fiber_g=data.fiber_g
    )
    
    db.add(food)
    db.commit()
    db.refresh(food)
    
    return {
        "success": True,
        "message": f"Food item '{food.food_name}' added successfully",
        "food": food
    }