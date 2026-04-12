from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.diet_plan import DietPlan
from app.api.deps import get_current_user
from app.models.user import User
import json
import uuid

router = APIRouter()

@router.get("/plan")
def get_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(DietPlan).filter(DietPlan.user_id == current_user.id).order_by(DietPlan.created_at.desc()).first()
    if not plan:
        return {"message": "No plan found"}
    return {"plan_data": json.loads(plan.plan_json) if plan.plan_json else None}

@router.post("/generate")
def generate_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = current_user.goal or "maintain"
    weight = current_user.weight or 70
    height = current_user.height or 170
    age = current_user.age or 25
    gender = current_user.gender or "male"
    
    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    
    if goal == "lose_weight":
        calories = int(bmr * 1.2 - 500)
    elif goal == "gain_muscle":
        calories = int(bmr * 1.5 + 300)
    else:
        calories = int(bmr * 1.3)
    
    plan_data = {
        "goal": goal,
        "daily_calories": calories,
        "protein_g": int((calories * 0.3) / 4),
        "carbs_g": int((calories * 0.45) / 4),
        "fat_g": int((calories * 0.25) / 9)
    }
    
    new_plan = DietPlan(
        id=uuid.uuid4(),
        user_id=current_user.id,
        title=f"{goal} Plan",
        plan_json=json.dumps(plan_data)
    )
    db.add(new_plan)
    db.commit()
    return {"message": "Plan generated", "plan_data": plan_data}