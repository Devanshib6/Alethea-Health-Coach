from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.diet_plan import DietPlan
from app.api.deps import get_current_user
from app.models.user import User
import json
import uuid

router = APIRouter()

def parse_plan_json(plan_json):
    """Parse plan_json whether it's string or dict"""
    if isinstance(plan_json, str):
        return json.loads(plan_json)
    return plan_json


@router.get("/plan")
def get_diet_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get the most recent diet plan for the logged-in user"""
    plan = db.query(DietPlan).filter(
        DietPlan.user_id == current_user.id
    ).order_by(DietPlan.created_at.desc()).first()
    
    if not plan:
        return {"message": "No diet plan found", "plan": None, "plan_data": None}
    
    plan_data = parse_plan_json(plan.plan_json)
    return {"plan": plan, "plan_data": plan_data}


@router.post("/generate")
def generate_diet_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Generate a personalized diet plan based on user profile"""
    
    # Get user data with defaults
    goal = current_user.goal or "maintain"
    diet_type = current_user.diet_type or "non-veg"
    weight = current_user.weight or 70
    height = current_user.height or 170
    age = current_user.age or 25
    gender = current_user.gender or "male"
    activity_level = current_user.activity_level or "moderate"

    # Calculate BMR using Mifflin-St Jeor equation
    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    # Activity multipliers
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    
    multiplier = activity_multipliers.get(activity_level, 1.55)
    tdee = bmr * multiplier

    # Adjust calories based on goal
    if goal in ["lose_weight", "lose weight"]:
        daily_calories = int(tdee - 500)
        goal_display = "Lose Weight"
    elif goal in ["gain_muscle", "gain muscle", "gain weight"]:
        daily_calories = int(tdee + 300)
        goal_display = "Gain Muscle"
    else:
        daily_calories = int(tdee)
        goal_display = "Maintain Weight"

    # Calculate macros based on diet type
    if diet_type in ["veg", "vegetarian"]:
        protein_pct = 0.25
        carbs_pct = 0.55
        fat_pct = 0.20
    elif diet_type == "keto":
        protein_pct = 0.30
        carbs_pct = 0.05
        fat_pct = 0.65
    elif diet_type == "high_protein":
        protein_pct = 0.40
        carbs_pct = 0.35
        fat_pct = 0.25
    else:  # non-veg or default
        protein_pct = 0.30
        carbs_pct = 0.45
        fat_pct = 0.25

    protein_g = int((daily_calories * protein_pct) / 4)
    carbs_g = int((daily_calories * carbs_pct) / 4)
    fat_g = int((daily_calories * fat_pct) / 9)

    # Complete weekly meal plan with ALL meals for EVERY day
    weekly_plan = {
        "Monday": {
            "breakfast": {"meal": "Poha with peas and peanuts", "calories": 250, "protein": 6, "carbs": 35, "fat": 8, "diet_type": "veg"},
            "lunch": {"meal": "Dal Tadka with Jeera Rice", "calories": 450, "protein": 14, "carbs": 65, "fat": 12, "diet_type": "veg"},
            "dinner": {"meal": "Vegetable Khichdi with Curd", "calories": 380, "protein": 10, "carbs": 55, "fat": 10, "diet_type": "veg"},
            "snack": {"meal": "Roasted Chana", "calories": 150, "protein": 8, "carbs": 25, "fat": 3, "diet_type": "veg"}
        },
        "Tuesday": {
            "breakfast": {"meal": "Vegetable Upma", "calories": 220, "protein": 5, "carbs": 35, "fat": 6, "diet_type": "veg"},
            "lunch": {"meal": "Chole Bhature", "calories": 550, "protein": 15, "carbs": 70, "fat": 20, "diet_type": "veg"},
            "dinner": {"meal": "Palak Paneer with Roti", "calories": 420, "protein": 16, "carbs": 35, "fat": 22, "diet_type": "veg"},
            "snack": {"meal": "Fruit Salad", "calories": 100, "protein": 1, "carbs": 25, "fat": 0.5, "diet_type": "veg"}
        },
        "Wednesday": {
            "breakfast": {"meal": "Sel Roti with Achar", "calories": 350, "protein": 6, "carbs": 50, "fat": 14, "diet_type": "veg"},
            "lunch": {"meal": "Dal Bhat (Nepali Style)", "calories": 480, "protein": 16, "carbs": 70, "fat": 12, "diet_type": "veg"},
            "dinner": {"meal": "Vegetable Momo", "calories": 280, "protein": 10, "carbs": 35, "fat": 10, "diet_type": "veg"},
            "snack": {"meal": "Chatamari (Nepali Pizza)", "calories": 220, "protein": 8, "carbs": 30, "fat": 8, "diet_type": "veg"}
        },
        "Thursday": {
            "breakfast": {"meal": "Aloo Paratha with Curd", "calories": 350, "protein": 8, "carbs": 45, "fat": 14, "diet_type": "veg"},
            "lunch": {"meal": "Paneer Butter Masala with Naan", "calories": 580, "protein": 18, "carbs": 45, "fat": 32, "diet_type": "veg"},
            "dinner": {"meal": "Dal Makhani with Rice", "calories": 420, "protein": 15, "carbs": 50, "fat": 16, "diet_type": "veg"},
            "snack": {"meal": "Bhel Puri", "calories": 180, "protein": 4, "carbs": 30, "fat": 6, "diet_type": "veg"}
        },
        "Friday": {
            "breakfast": {"meal": "Dosa with Sambhar and Chutney", "calories": 220, "protein": 5, "carbs": 35, "fat": 6, "diet_type": "veg"},
            "lunch": {"meal": "Kadhi Pakora with Rice", "calories": 460, "protein": 12, "carbs": 55, "fat": 18, "diet_type": "veg"},
            "dinner": {"meal": "Aloo Gobi with Roti", "calories": 320, "protein": 7, "carbs": 38, "fat": 14, "diet_type": "veg"},
            "snack": {"meal": "Samosa", "calories": 250, "protein": 5, "carbs": 30, "fat": 12, "diet_type": "veg"}
        },
        "Saturday": {
            "breakfast": {"meal": "Masala Dosa", "calories": 280, "protein": 6, "carbs": 40, "fat": 10, "diet_type": "veg"},
            "lunch": {"meal": "Veg Biryani with Raita", "calories": 500, "protein": 12, "carbs": 70, "fat": 16, "diet_type": "veg"},
            "dinner": {"meal": "Baingan Bharta with Roti", "calories": 340, "protein": 5, "carbs": 35, "fat": 18, "diet_type": "veg"},
            "snack": {"meal": "Dhokla", "calories": 150, "protein": 6, "carbs": 20, "fat": 5, "diet_type": "veg"}
        },
        "Sunday": {
            "breakfast": {"meal": "Puri Sabzi", "calories": 400, "protein": 8, "carbs": 50, "fat": 18, "diet_type": "veg"},
            "lunch": {"meal": "Malai Kofta with Naan", "calories": 550, "protein": 12, "carbs": 45, "fat": 32, "diet_type": "veg"},
            "dinner": {"meal": "Simple Dal Chawal with Papad", "calories": 350, "protein": 12, "carbs": 55, "fat": 8, "diet_type": "veg"},
            "snack": {"meal": "Kheer", "calories": 200, "protein": 5, "carbs": 35, "fat": 5, "diet_type": "veg"}
        }
    }

    # Filter weekly plan based on user's diet type
    filtered_weekly_plan = {}
    user_diet_lower = diet_type.lower()
    
    for day, meals in weekly_plan.items():
        filtered_meals = {}
        for meal_type, meal in meals.items():
            meal_diet = meal.get("diet_type", "veg").lower()
            
            # Check if meal is allowed based on user's diet type
            is_allowed = True
            if user_diet_lower == "veg":
                is_allowed = meal_diet == "veg"
            elif user_diet_lower == "eggitarian":
                is_allowed = meal_diet in ["veg", "eggitarian"]
            # Non-veg can eat everything
            
            if is_allowed:
                filtered_meals[meal_type] = meal
        
        if filtered_meals:
            filtered_weekly_plan[day] = filtered_meals

    plan_data = {
        "goal": goal_display,
        "goal_key": goal,
        "diet_type": diet_type,
        "daily_calories": daily_calories,
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
        "weekly_plan": filtered_weekly_plan,
        "tips": [
            "Drink at least 8 glasses of water daily",
            "Eat slowly and mindfully",
            "Do not skip breakfast",
            "Include at least 5 servings of fruits and vegetables daily",
            "Limit processed foods and added sugars",
            "Plan your meals ahead of time",
            "Listen to your body's hunger and fullness cues"
        ]
    }

    # Delete old plans
    old_plans = db.query(DietPlan).filter(
        DietPlan.user_id == current_user.id
    ).all()
    
    for old_plan in old_plans:
        db.delete(old_plan)

    # Save new plan
    new_plan = DietPlan(
        id=uuid.uuid4(),
        user_id=current_user.id,
        title=f"{goal_display} Diet Plan for {current_user.full_name}",
        description=f"Personalized {diet_type} diet plan targeting {daily_calories} calories per day",
        plan_json=json.dumps(plan_data)
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return {"message": "Diet plan generated successfully", "plan_data": plan_data}


@router.get("/weekly")
def get_weekly_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get the weekly meal plan from the most recent diet plan"""
    plan = db.query(DietPlan).filter(
        DietPlan.user_id == current_user.id
    ).order_by(DietPlan.created_at.desc()).first()
    
    if not plan:
        return {"message": "No plan found. Please generate a diet plan first.", "weekly_plan": None}
    
    plan_data = parse_plan_json(plan.plan_json)
    
    return {
        "weekly_plan": plan_data.get("weekly_plan"), 
        "daily_calories": plan_data.get("daily_calories")
    }