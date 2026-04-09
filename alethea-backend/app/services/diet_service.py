from sqlalchemy.orm import Session
from app.models.diet_plan import DietPlan
from app.services.ml_service import calculate_daily_calories, get_nutrition_recommendation
import json
import uuid

def generate_plan(db: Session, user):
    goal = user.goal or "maintain"
    diet_type = user.diet_type or "balanced"
    weight = user.weight or 70
    height = user.height or 170
    age = user.age or 25
    gender = user.gender or "male"
    activity = user.activity_level or "moderate"

    daily_calories = calculate_daily_calories(weight, height, age, gender, activity, goal)
    nutrition = get_nutrition_recommendation(daily_calories, diet_type)

    plan_data = {
        "goal": goal,
        "diet_type": diet_type,
        "daily_calories": daily_calories,
        "protein_g": nutrition["protein_g"],
        "carbs_g": nutrition["carbs_g"],
        "fat_g": nutrition["fat_g"]
    }

    new_plan = DietPlan(
        id=uuid.uuid4(),
        user_id=user.id,
        title=f"{goal.title()} Plan",
        description=f"Targeting {daily_calories} calories/day",
        plan_json=json.dumps(plan_data)
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return plan_data