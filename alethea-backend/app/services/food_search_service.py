import requests
import json
from typing import List, Dict, Any

class FoodSearchService:
    def __init__(self):
        self.base_url = "https://world.openfoodfacts.org"
        self.user_agent = "AletheaHealthCoach-FYP/1.0"
    
    def search_food(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Search for food products by name"""
        try:
            url = f"{self.base_url}/cgi/search.pl"
            params = {
                "search_terms": query,
                "search_simple": 1,
                "action": "process",
                "json": 1,
                "page_size": max_results,
                "page": 1
            }
            headers = {
                "User-Agent": self.user_agent,
                "Accept": "application/json"
            }
            
            print(f"Searching for: {query}")  # Debug log
            response = requests.get(url, params=params, headers=headers, timeout=15)
            print(f"Response status: {response.status_code}")  # Debug log
            
            # Check if response is valid JSON
            if response.status_code != 200:
                print(f"API returned status {response.status_code}")
                return []
            
            try:
                data = response.json()
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Response text preview: {response.text[:200]}")
                return []
            
            products = []
            for product in data.get('products', [])[:max_results]:
                nutriments = product.get('nutriments', {})
                
                # Only add products with at least a name
                if product.get('product_name'):
                    products.append({
                        'food_name': product.get('product_name', ''),
                        'brand': product.get('brands', ''),
                        'calories': nutriments.get('energy-kcal_100g'),
                        'protein': nutriments.get('proteins_100g'),
                        'carbs': nutriments.get('carbohydrates_100g'),
                        'fat': nutriments.get('fat_100g'),
                        'fiber': nutriments.get('fiber_100g'),
                        'sugar': nutriments.get('sugars_100g'),
                        'image_url': product.get('image_url', ''),
                        'barcode': product.get('code', '')
                    })
            
            print(f"Found {len(products)} products")  # Debug log
            return products
            
        except requests.exceptions.Timeout:
            print("Request timeout")
            return []
        except requests.exceptions.ConnectionError:
            print("Connection error")
            return []
        except Exception as e:
            print(f"Unexpected error searching food: {e}")
            return []
    
    def get_product_by_barcode(self, barcode: str) -> Dict[str, Any]:
        """Get product info by barcode"""
        try:
            url = f"{self.base_url}/api/v0/product/{barcode}.json"
            headers = {
                "User-Agent": self.user_agent,
                "Accept": "application/json"
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                return {}
            
            try:
                data = response.json()
            except json.JSONDecodeError:
                return {}
            
            if data.get('status') == 1:
                product = data.get('product', {})
                nutriments = product.get('nutriments', {})
                
                return {
                    'food_name': product.get('product_name', ''),
                    'brand': product.get('brands', ''),
                    'calories': nutriments.get('energy-kcal_100g'),
                    'protein': nutriments.get('proteins_100g'),
                    'carbs': nutriments.get('carbohydrates_100g'),
                    'fat': nutriments.get('fat_100g'),
                    'fiber': nutriments.get('fiber_100g'),
                    'sugar': nutriments.get('sugars_100g'),
                    'image_url': product.get('image_url', '')
                }
            return {}
        except Exception as e:
            print(f"Error fetching product by barcode: {e}")
            return {}