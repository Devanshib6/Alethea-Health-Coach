from app.db.database import get_db
from app.schemas.meal import MealCreate, MealUpdate
from fastapi import HTTPException, status
from datetime import datetime, date, timedelta
from typing import Optional, List

class MealService:
    def __init__(self):
        self.db = get_db()
    
    def add_meal(self, user_id: str, meal_data: MealCreate):
        meal_dict = meal_data.dict()
        meal_dict["user_id"] = user_id
        meal_dict["date"] = meal_data.date.isoformat()
        
        result = self.db.table("meals").insert(meal_dict).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add meal"
            )
        
        # Update health log
        self._update_health_log(user_id, meal_data.date, meal_data.calories)
        
        return result.data[0]
    
    def get_user_meals(self, user_id: str, start_date: Optional[date], end_date: Optional[date]):
        query = self.db.table("meals").select("*").eq("user_id", user_id)
        
        if start_date:
            query = query.gte("date", start_date.isoformat())
        if end_date:
            query = query.lte("date", end_date.isoformat())
        
        result = query.order("date", desc=True).execute()
        return result.data
    
    def get_daily_summary(self, user_id: str, date_str: date):
        # Convert date to string if needed
        if hasattr(date_str, 'isoformat'):
            date_str = date_str.isoformat()
        
        result = self.db.table("meals").select("*").eq("user_id", user_id).eq("date", date_str).execute()
        
        meals = result.data
        total_calories = sum(meal.get("calories", 0) for meal in meals)
        total_protein = sum(meal.get("protein", 0) for meal in meals)
        total_carbs = sum(meal.get("carbs", 0) for meal in meals)
        total_fat = sum(meal.get("fat", 0) for meal in meals)
        
        return {
            "date": date_str,
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_carbs": total_carbs,
            "total_fat": total_fat,
            "meals_count": len(meals)
        }
    
    def update_meal(self, meal_id: str, user_id: str, meal_data: MealUpdate):
        # Verify meal belongs to user
        check = self.db.table("meals").select("*").eq("id", meal_id).eq("user_id", user_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Meal not found")
        
        update_dict = meal_data.dict(exclude_unset=True)
        if "date" in update_dict and update_dict["date"]:
            update_dict["date"] = update_dict["date"].isoformat()
        
        result = self.db.table("meals").update(update_dict).eq("id", meal_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update meal"
            )
        
        return result.data[0]
    
    def delete_meal(self, meal_id: str, user_id: str):
        # Verify meal belongs to user
        check = self.db.table("meals").select("*").eq("id", meal_id).eq("user_id", user_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Meal not found")
        
        result = self.db.table("meals").delete().eq("id", meal_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete meal"
            )
    
    def get_weekly_summary(self, user_id: str):
        end_date = date.today()
        start_date = end_date - timedelta(days=7)
        
        result = self.db.table("meals").select("*").eq("user_id", user_id).gte("date", start_date.isoformat()).execute()
        
        daily_summaries = {}
        for meal in result.data:
            meal_date = meal["date"]
            if meal_date not in daily_summaries:
                daily_summaries[meal_date] = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
            
            daily_summaries[meal_date]["calories"] += meal["calories"]
            daily_summaries[meal_date]["protein"] += meal["protein"]
            daily_summaries[meal_date]["carbs"] += meal["carbs"]
            daily_summaries[meal_date]["fat"] += meal["fat"]
        
        return [{"date": d, **summary} for d, summary in daily_summaries.items()]
    
    def _update_health_log(self, user_id: str, log_date: date, calories: float):
        # Check if log exists
        existing = self.db.table("health_logs").select("*").eq("user_id", user_id).eq("date", log_date.isoformat()).execute()
        
        if existing.data:
            # Update existing log
            new_calories = existing.data[0].get("calories_consumed", 0) + calories
            self.db.table("health_logs").update({
                "calories_consumed": new_calories
            }).eq("id", existing.data[0]["id"]).execute()
        else:
            # Create new log
            self.db.table("health_logs").insert({
                "user_id": user_id,
                "calories_consumed": calories,
                "date": log_date.isoformat()
            }).execute()