from fastapi import APIRouter, Depends, Query
import requests
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/search")
def search_food(query: str = Query(..., min_length=1), current_user: User = Depends(get_current_user)):
    url = f"https://world.openfoodfacts.org/cgi/search.pl"
    params = {"search_terms": query, "search_simple": 1, "action": "process", "json": 1, "page_size": 10}
    response = requests.get(url, params=params, headers={"User-Agent": "Alethea/1.0"})
    
    if response.status_code != 200:
        return {"results": []}
    
    data = response.json()
    results = []
    for product in data.get("products", []):
        nutriments = product.get("nutriments", {})
        results.append({
            "food_name": product.get("product_name", ""),
            "brand": product.get("brands", ""),
            "calories": nutriments.get("energy-kcal_100g"),
            "protein": nutriments.get("proteins_100g"),
            "carbs": nutriments.get("carbohydrates_100g"),
            "fat": nutriments.get("fat_100g")
        })
    return {"results": results}