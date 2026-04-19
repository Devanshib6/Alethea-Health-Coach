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
    if isinstance(plan_json, str):
        return json.loads(plan_json)
    return plan_json

@router.get("/plan")
def get_diet_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(DietPlan).filter(
        DietPlan.user_id == current_user.id
    ).order_by(DietPlan.created_at.desc()).first()
    
    if not plan:
        return {"message": "No diet plan found", "plan": None, "plan_data": None}
    
    plan_data = parse_plan_json(plan.plan_json)
    return {"plan": plan, "plan_data": plan_data}

@router.post("/generate")
def generate_diet_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = current_user.goal or "maintain"
    diet_type = current_user.diet_type or "balanced"
    weight = current_user.weight or 70
    height = current_user.height or 170
    age = current_user.age or 25
    gender = current_user.gender or "male"
    activity = current_user.activity_level or "moderate"

    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    multipliers = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725, "very_active": 1.9}
    tdee = bmr * multipliers.get(activity, 1.3)

    if goal in ["lose_weight", "lose weight"]:
        daily_calories = int(tdee - 500)
    elif goal in ["gain_muscle", "gain muscle"]:
        daily_calories = int(tdee + 300)
    else:
        daily_calories = int(tdee)

    if diet_type == "keto":
        protein_g = int((daily_calories * 0.30) / 4)
        carbs_g = int((daily_calories * 0.05) / 4)
        fat_g = int((daily_calories * 0.65) / 9)
    elif diet_type == "high_protein":
        protein_g = int((daily_calories * 0.40) / 4)
        carbs_g = int((daily_calories * 0.35) / 4)
        fat_g = int((daily_calories * 0.25) / 9)
    else:
        protein_g = int((daily_calories * 0.30) / 4)
        carbs_g = int((daily_calories * 0.45) / 4)
        fat_g = int((daily_calories * 0.25) / 9)

    weekly_plan = {
        "Monday": {
            "breakfast": {"meal": "Oatmeal with banana and honey", "calories": 350, "protein": 12, "carbs": 60, "fat": 6},
            "lunch": {"meal": "Grilled chicken with brown rice", "calories": 520, "protein": 45, "carbs": 48, "fat": 12},
            "dinner": {"meal": "Salmon with steamed vegetables", "calories": 480, "protein": 40, "carbs": 25, "fat": 22},
            "snack": {"meal": "Greek yogurt with berries", "calories": 150, "protein": 10, "carbs": 18, "fat": 3}
        },
        "Tuesday": {
            "breakfast": {"meal": "Scrambled eggs with toast", "calories": 380, "protein": 20, "carbs": 35, "fat": 16},
            "lunch": {"meal": "Lentil soup with bread", "calories": 440, "protein": 22, "carbs": 65, "fat": 8},
            "dinner": {"meal": "Chicken stir fry", "calories": 510, "protein": 38, "carbs": 55, "fat": 14},
            "snack": {"meal": "Apple with peanut butter", "calories": 200, "protein": 5, "carbs": 28, "fat": 9}
        },
        "Wednesday": {
            "breakfast": {"meal": "Smoothie bowl", "calories": 400, "protein": 10, "carbs": 70, "fat": 8},
            "lunch": {"meal": "Tuna sandwich", "calories": 450, "protein": 35, "carbs": 42, "fat": 12},
            "dinner": {"meal": "Beef curry with rice", "calories": 560, "protein": 42, "carbs": 58, "fat": 18},
            "snack": {"meal": "Mixed nuts", "calories": 180, "protein": 5, "carbs": 20, "fat": 10}
        },
        "Thursday": {
            "breakfast": {"meal": "Avocado toast with eggs", "calories": 420, "protein": 18, "carbs": 38, "fat": 22},
            "lunch": {"meal": "Quinoa salad", "calories": 480, "protein": 20, "carbs": 62, "fat": 14},
            "dinner": {"meal": "Grilled fish with potatoes", "calories": 490, "protein": 38, "carbs": 42, "fat": 16},
            "snack": {"meal": "Protein shake", "calories": 160, "protein": 22, "carbs": 12, "fat": 3}
        },
        "Friday": {
            "breakfast": {"meal": "Pancakes with fruits", "calories": 450, "protein": 12, "carbs": 75, "fat": 12},
            "lunch": {"meal": "Chicken caesar salad", "calories": 420, "protein": 35, "carbs": 25, "fat": 22},
            "dinner": {"meal": "Pasta with lean beef", "calories": 580, "protein": 38, "carbs": 68, "fat": 16},
            "snack": {"meal": "Cottage cheese", "calories": 120, "protein": 14, "carbs": 6, "fat": 3}
        },
        "Saturday": {
            "breakfast": {"meal": "French toast with berries", "calories": 380, "protein": 14, "carbs": 55, "fat": 12},
            "lunch": {"meal": "Vegetable wrap", "calories": 400, "protein": 14, "carbs": 58, "fat": 14},
            "dinner": {"meal": "Grilled chicken with sweet potato", "calories": 520, "protein": 42, "carbs": 48, "fat": 14},
            "snack": {"meal": "Banana with almond butter", "calories": 210, "protein": 5, "carbs": 30, "fat": 9}
        },
        "Sunday": {
            "breakfast": {"meal": "Full breakfast", "calories": 480, "protein": 22, "carbs": 52, "fat": 20},
            "lunch": {"meal": "Lamb chops with vegetables", "calories": 560, "protein": 45, "carbs": 28, "fat": 28},
            "dinner": {"meal": "Light salad with shrimp", "calories": 380, "protein": 32, "carbs": 22, "fat": 16},
            "snack": {"meal": "Dark chocolate and almonds", "calories": 160, "protein": 4, "carbs": 16, "fat": 10}
        }
    }

    plan_data = {
        "goal": goal,
        "diet_type": diet_type,
        "daily_calories": daily_calories,
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
        "weekly_plan": weekly_plan,
        "tips": [
            "Drink at least 8 glasses of water daily",
            "Eat slowly and mindfully",
            "Do not skip breakfast",
            "Include 5 servings of fruits and vegetables daily",
            "Limit processed foods and added sugars"
        ]
    }

    new_plan = DietPlan(
        id=uuid.uuid4(),
        user_id=current_user.id,
        title=f"{goal.title()} Diet Plan",
        description=f"Personalized {diet_type} diet plan targeting {daily_calories} calories per day",
        plan_json=json.dumps(plan_data)
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return {"message": "Diet plan generated", "plan_data": plan_data}

# ADD THIS MISSING ENDPOINT
@router.get("/weekly")
def get_weekly_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(DietPlan).filter(
        DietPlan.user_id == current_user.id
    ).order_by(DietPlan.created_at.desc()).first()
    
    if not plan:
        return {"message": "No plan found. Please generate a diet plan first.", "weekly_plan": None}
    
    plan_data = parse_plan_json(plan.plan_json)
    return {"weekly_plan": plan_data.get("weekly_plan"), "daily_calories": plan_data.get("daily_calories")}