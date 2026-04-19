from sqlalchemy.orm import Session
from app.models.food_database import FoodItem  # You may need to create this model

class FoodSearchService:
    def __init__(self, db: Session):
        self.db = db
    
    def search_food(self, query: str, limit: int = 10):
        # Search in your local food_database table
        results = self.db.query(FoodItem).filter(
            FoodItem.food_name.ilike(f'%{query}%')
        ).limit(limit).all()
        
        return [{
            'food_name': r.food_name,
            'calories': r.calories_per_100g,
            'protein': r.protein_per_100g,
            'carbs': r.carbs_per_100g,
            'fat': r.fat_per_100g,
            'fiber': r.fiber_g
        } for r in results]