from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.api.deps import get_current_user
from app.models.user import User
from app.models.food_database import FoodDatabase
from app.core.database import get_db

router = APIRouter()

@router.get("/search")
def search_food(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Base search query
    results = db.query(FoodDatabase).filter(
        FoodDatabase.food_name.ilike(f'%{query}%')
    )
    
    # Filter by user's diet type
    user_diet = (current_user.diet_type or 'Non-Veg').lower()
    
    if user_diet == 'veg':
        # Vegetarian: only Veg items
        results = results.filter(FoodDatabase.diet_type == 'Veg')
    elif user_diet == 'eggitarian':
        # Eggitarian: Veg + Eggitarian items
        results = results.filter(
            or_(
                FoodDatabase.diet_type == 'Veg',
                FoodDatabase.diet_type == 'Eggitarian'
            )
        )
    # Non-Veg: no filter - can see everything
    
    results = results.limit(limit).all()
    
    return {
        "success": True, 
        "query": query, 
        "count": len(results), 
        "user_diet": user_diet,
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

@router.get("/barcode/{barcode}")
def get_food_by_barcode(
    barcode: str, 
    current_user: User = Depends(get_current_user)
):
    from app.services.food_search_service import FoodSearchService
    food_search = FoodSearchService()
    result = food_search.get_product_by_barcode(barcode)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result