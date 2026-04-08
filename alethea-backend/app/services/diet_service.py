from app.db.database import get_db
from app.services.user_service import UserService
from app.ml.diet_engine import DietGenerator
from fastapi import HTTPException, status
from datetime import datetime

class DietService:
    def __init__(self):
        self.db = get_db()
        self.user_service = UserService()
        self.diet_generator = DietGenerator()
    
    def generate_diet_plan(self, user_id: str, goal: str = None, days: int = 7):
        # Get user profile
        profile = self.user_service.get_user_profile(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Use provided goal or user's goal
        target_goal = goal or profile.get("goal", "maintenance")
        
        # Generate diet plan
        diet_plan = self.diet_generator.generate_plan(profile, target_goal, days)
        
        # Save to database
        plan_result = self.db.table("diet_plans").insert({
            "user_id": user_id,
            "plan_json": diet_plan
        }).execute()
        
        if not plan_result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save diet plan"
            )
        
        return {
            "plan": diet_plan["meals"],
            "goal": target_goal,
            "daily_calorie_target": diet_plan["daily_calories"],
            "generated_date": datetime.now().isoformat()
        }
    
    def get_user_diet_plans(self, user_id: str):
        result = self.db.table("diet_plans").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data
    
    def get_diet_plan(self, plan_id: str, user_id: str):
        result = self.db.table("diet_plans").select("*").eq("id", plan_id).eq("user_id", user_id).execute()
        if result.data:
            return result.data[0]
        return None