import requests

class FoodSearchService:
    def __init__(self):
        self.base_url = "https://world.openfoodfacts.org"

    def search_food(self, query, limit=10):
        url = f"{self.base_url}/cgi/search.pl"
        params = {"search_terms": query, "json": 1, "page_size": limit}
        response = requests.get(url, params=params, headers={"User-Agent": "Alethea/1.0"})
        
        if response.status_code != 200:
            return []
        
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
        return results