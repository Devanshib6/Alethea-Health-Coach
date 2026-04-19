from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.services.food_search_service import FoodSearchService
from app.api.deps import get_current_user
from app.models.user import User
from app.models.food_item import FoodItem
from app.core.database import get_db
from pydantic import BaseModel
from typing import Optional
import uuid

# This line was missing! Create the router
router = APIRouter()

food_search = FoodSearchService()

# Request schema for adding food
class FoodItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fats_per_100g: Optional[float] = None
    fiber_per_100g: Optional[float] = None

@router.get("/search")
def search_food(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    results = food_search.search_food(query, limit)
    return {"success": True, "query": query, "count": len(results), "results": results}

@router.get("/barcode/{barcode}")
def get_food_by_barcode(
    barcode: str, 
    current_user: User = Depends(get_current_user)
):
    result = food_search.get_product_by_barcode(barcode)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result

@router.post("/add")
def add_food_item(
    data: FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can add food items
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    
    # Create new food item
    food = FoodItem(
        id=uuid.uuid4(),
        name=data.name,
        category=data.category,
        calories_per_100g=data.calories_per_100g,
        protein_per_100g=data.protein_per_100g,
        carbs_per_100g=data.carbs_per_100g,
        fats_per_100g=data.fats_per_100g,
        fiber_per_100g=data.fiber_per_100g
    )
    
    db.add(food)
    db.commit()
    db.refresh(food)
    
    return {
        "success": True,
        "message": f"Food item '{food.name}' added successfully",
        "food": food
    }