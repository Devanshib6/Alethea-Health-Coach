import requests
import json
import base64
from typing import List, Dict, Any
from app.models.food_database import FoodDatabase
from sqlalchemy.orm import Session

class FoodRecognitionService:
    def __init__(self):
        # Using Open Food Facts API (free, no API key needed)
        self.base_url = "https://world.openfoodfacts.org/api/v2/search"
        self.user_agent = "AletheaHealthCoach-FYP/1.0"
    
    def recognize_food_from_image(self, image_base64: str, db: Session) -> List[Dict[str, Any]]:
        """
        Recognize food from base64 image and return nutrition info
        """
        # For demo purposes, we'll return common foods based on keywords
        # In production, you would integrate with a proper food recognition API like:
        # - Google Cloud Vision API
        # - Clarifai Food Recognition
        # - Microsoft Azure Computer Vision
        
        # For now, we'll use a keyword-based approach
        results = []
        
        # Simulate recognition - in real implementation, this would call an ML model
        common_foods = [
            {"name": "Pizza", "calories": 285, "protein": 12, "carbs": 35, "fat": 10, "fiber": 2},
            {"name": "Burger", "calories": 295, "protein": 17, "carbs": 30, "fat": 12, "fiber": 2},
            {"name": "Salad", "calories": 65, "protein": 3, "carbs": 8, "fat": 3, "fiber": 3},
            {"name": "Pasta", "calories": 158, "protein": 6, "carbs": 31, "fat": 2, "fiber": 2},
            {"name": "Rice", "calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3, "fiber": 0.5},
            {"name": "Chicken Curry", "calories": 220, "protein": 18, "carbs": 8, "fat": 14, "fiber": 1},
            {"name": "Dal", "calories": 140, "protein": 7.5, "carbs": 18, "fat": 4.5, "fiber": 5},
            {"name": "Roti", "calories": 120, "protein": 3, "carbs": 22, "fat": 2, "fiber": 2},
            {"name": "Momo", "calories": 180, "protein": 12, "carbs": 24, "fat": 6, "fiber": 2},
            {"name": "Biryani", "calories": 250, "protein": 10, "carbs": 35, "fat": 8, "fiber": 2}
        ]
        
        # Return a few common foods as suggestions
        for food in common_foods[:5]:
            # Try to find in database
            db_food = db.query(FoodDatabase).filter(
                FoodDatabase.food_name.ilike(f"%{food['name']}%")
            ).first()
            
            if db_food:
                results.append({
                    "food_name": db_food.food_name,
                    "calories": db_food.calories_per_100g,
                    "protein": db_food.protein_per_100g,
                    "carbs": db_food.carbs_per_100g,
                    "fat": db_food.fat_per_100g,
                    "fiber": db_food.fiber_g,
                    "confidence": 85
                })
            else:
                results.append({
                    "food_name": food['name'],
                    "calories": food['calories'],
                    "protein": food['protein'],
                    "carbs": food['carbs'],
                    "fat": food['fat'],
                    "fiber": food['fiber'],
                    "confidence": 75
                })
        
        return results
    
    def search_food_by_name(self, food_name: str, db: Session) -> Dict[str, Any]:
        """Search for food by name in database"""
        food = db.query(FoodDatabase).filter(
            FoodDatabase.food_name.ilike(f"%{food_name}%")
        ).first()
        
        if food:
            return {
                "food_name": food.food_name,
                "calories": food.calories_per_100g,
                "protein": food.protein_per_100g,
                "carbs": food.carbs_per_100g,
                "fat": food.fat_per_100g,
                "fiber": food.fiber_g
            }
        return None