from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.diet_plan import DietPlan
from app.api.deps import get_current_user
from app.models.user import User
import json

router = APIRouter()

@router.get("/plan")
def get_diet_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(DietPlan).filter(DietPlan.user_id == current_user.id).order_by(DietPlan.created_at.desc()).first()
    if not plan:
        return {"message": "No diet plan found. Please generate one."}
    return plan

@router.post("/generate")
def generate_diet_plan(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # basic rule-based plan based on user goal
    goal = current_user.goal or "maintain"
    plan_data = {
        "goal": goal,
        "daily_calories": 2000 if goal == "maintain" else (1700 if goal == "lose weight" else 2500),
        "meals_per_day": 3,
        "note": "Generated based on your profile"
    }
    new_plan = DietPlan(
        user_id=current_user.id,
        title=f"Diet Plan for {current_user.full_name}",
        plan_data=json.dumps(plan_data)
    )
    db.add(new_plan)
    db.commit()
    return {"message": "Diet plan generated", "plan": plan_data}