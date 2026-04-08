from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.food_search_service import FoodSearchService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()
food_search = FoodSearchService()

@router.get("/search")
def search_food(
    query: str = Query(..., min_length=1, description="Food name to search"),
    limit: int = Query(10, ge=1, le=50, description="Number of results"),
    current_user: User = Depends(get_current_user)
):
    """Search for food products using Open Food Facts API"""
    results = food_search.search_food(query, limit)
    return {
        "success": True,
        "query": query,
        "count": len(results),
        "results": results
    }

@router.get("/barcode/{barcode}")
def get_food_by_barcode(
    barcode: str,
    current_user: User = Depends(get_current_user)
):
    """Get food product information by barcode"""
    result = food_search.get_product_by_barcode(barcode)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result