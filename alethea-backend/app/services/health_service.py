from app.db.database import get_db
from app.services.user_service import UserService
from app.schemas.health import BMIResponse, HealthReport, HealthLogCreate
from datetime import datetime, date, timedelta
from typing import Optional

class HealthService:
    def __init__(self):
        self.db = get_db()
        self.user_service = UserService()
    
    def calculate_bmi(self, user_id: str):
        profile = self.user_service.get_user_profile(user_id)
        
        if not profile or not profile.get("weight") or not profile.get("height"):
            raise HTTPException(status_code=400, detail="Weight and height required for BMI calculation")
        
        height_m = profile["height"] / 100
        bmi = profile["weight"] / (height_m * height_m)
        
        # Determine BMI category
        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25:
            category = "Normal weight"
        elif bmi < 30:
            category = "Overweight"
        else:
            category = "Obese"
        
        # Calculate ideal weight range
        ideal_min = 18.5 * (height_m * height_m)
        ideal_max = 24.9 * (height_m * height_m)
        
        # Save to health log
        self.db.table("health_logs").insert({
            "user_id": user_id,
            "weight": profile["weight"],
            "bmi": round(bmi, 2),
            "date": date.today().isoformat()
        }).execute()
        
        return BMIResponse(
            bmi=round(bmi, 2),
            category=category,
            ideal_weight_range=f"{ideal_min:.1f} - {ideal_max:.1f} kg"
        )
    
    def generate_health_report(self, user_id: str, days: int = 30):
        profile = self.user_service.get_user_profile(user_id)
        start_date = date.today() - timedelta(days=days)
        
        # Get meals data
        meals = self.db.table("meals").select("*").eq("user_id", user_id).gte("date", start_date.isoformat()).execute()
        
        # Calculate average daily calories
        daily_calories = {}
        for meal in meals.data:
            meal_date = meal["date"]
            daily_calories[meal_date] = daily_calories.get(meal_date, 0) + meal["calories"]
        
        avg_calories = sum(daily_calories.values()) / len(daily_calories) if daily_calories else 0
        
        # Get latest BMI
        bmi_data = None
        if profile and profile.get("weight") and profile.get("height"):
            height_m = profile["height"] / 100
            bmi = profile["weight"] / (height_m * height_m)
            bmi_data = round(bmi, 2)
            
            if bmi < 18.5:
                bmi_category = "Underweight"
                recommendation = "Focus on nutrient-dense foods to increase calorie intake healthily."
            elif bmi < 25:
                bmi_category = "Normal weight"
                recommendation = "Maintain your balanced diet and regular exercise routine."
            elif bmi < 30:
                bmi_category = "Overweight"
                recommendation = "Consider a moderate calorie deficit and increased physical activity."
            else:
                bmi_category = "Obese"
                recommendation = "Consult a healthcare provider for a personalized weight management plan."
        else:
            bmi_data = None
            bmi_category = "Unknown"
            recommendation = "Complete your profile with height and weight for personalized recommendations."
        
        # Determine weight trend
        weight_logs = self.db.table("health_logs").select("*").eq("user_id", user_id).gte("date", start_date.isoformat()).order("date").execute()
        
        if len(weight_logs.data) >= 2:
            first_weight = weight_logs.data[0].get("weight")
            last_weight = weight_logs.data[-1].get("weight")
            
            if last_weight and first_weight:
                if last_weight < first_weight:
                    weight_trend = "Decreasing"
                elif last_weight > first_weight:
                    weight_trend = "Increasing"
                else:
                    weight_trend = "Stable"
            else:
                weight_trend = "Insufficient data"
        else:
            weight_trend = "Insufficient data"
        
        return HealthReport(
            current_bmi=bmi_data,
            bmi_category=bmi_category,
            average_daily_calories=round(avg_calories, 2),
            weight_trend=weight_trend,
            recommendation=recommendation
        )
    
    def log_health_metrics(self, user_id: str, health_data: HealthLogCreate):
        log_dict = health_data.dict(exclude_unset=True)
        log_dict["user_id"] = user_id
        log_dict["date"] = date.today().isoformat()
        
        # Update profile weight if provided
        if health_data.weight:
            self.db.table("profiles").update({"weight": health_data.weight}).eq("user_id", user_id).execute()
        
        result = self.db.table("health_logs").insert(log_dict).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to log health metrics"
            )
        
        return result.data[0]
    
    def get_weight_trend(self, user_id: str, days: int = 30):
        start_date = date.today() - timedelta(days=days)
        
        result = self.db.table("health_logs").select("weight", "date").eq("user_id", user_id).gte("date", start_date.isoformat()).order("date").execute()
        
        return [{"date": log["date"], "weight": log["weight"]} for log in result.data if log.get("weight")]
    
    def get_health_metrics(self, user_id: str, start_date: Optional[date], end_date: Optional[date]):
        query = self.db.table("health_logs").select("*").eq("user_id", user_id)
        
        if start_date:
            query = query.gte("date", start_date.isoformat())
        if end_date:
            query = query.lte("date", end_date.isoformat())
        
        result = query.order("date").execute()
        return result.data