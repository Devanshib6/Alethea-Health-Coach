from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import Body
from app.services.food_search_service import FoodSearchService
from app.api.deps import get_current_user
from app.models.user import User
from app.models.food_item import FoodItem
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.schemas.food_item import FoodItemCreate
import uuid

router = APIRouter()
food_search = FoodSearchService()

@router.get("/search")
def search_food(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    results = food_search.search_food(query, limit)
    return {"success": True, "query": query, "count": len(results), "results": results}

@router.get("/barcode/{barcode}")
def get_food_by_barcode(barcode: str, current_user: User = Depends(get_current_user)):
    result = food_search.get_product_by_barcode(barcode)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result

@router.post("/add")
def add_food_item(data: FoodItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
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
    return food