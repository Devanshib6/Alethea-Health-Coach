from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    # Get user info
    user = db.execute(
        text("SELECT * FROM users WHERE id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    # Get profile
    profile = db.execute(
        text("SELECT * FROM profiles WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    # Get goals
    goals = db.execute(
        text("SELECT * FROM health_goals WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    # Get today's meals
    meals = db.execute(
        text("""
            SELECT * FROM meals
            WHERE user_id = :user_id
            AND DATE(created_at) = CURRENT_DATE
            ORDER BY created_at DESC
        """),
        {"user_id": user_id}
    ).fetchall()

    # Get latest health metrics
    metrics = db.execute(
        text("""
            SELECT * FROM health_metrics
            WHERE user_id = :user_id
            ORDER BY recorded_date DESC
            LIMIT 7
        """),
        {"user_id": user_id}
    ).fetchall()

    # Calculate BMI
    bmi = None
    bmi_category = None
    if profile and profile.height and profile.weight:
        height_m = profile.height / 100
        bmi = round(profile.weight / (height_m ** 2), 1)
        if bmi < 18.5:
            bmi_category = "Underweight"
        elif bmi < 25:
            bmi_category = "Normal"
        elif bmi < 30:
            bmi_category = "Overweight"
        else:
            bmi_category = "Obese"

    # Calculate total calories today
    total_calories = sum(m.total_calories or 0 for m in meals)

    # Calculate goal progress
    goal_progress = None
    if profile and goals and goals.target_weight:
        current = profile.weight
        target = goals.target_weight
        if goals.primary_goal == "lose_weight":
            goal_progress = round(max(0, min(100, (1 - (current - target) / max(current, 1)) * 100)), 1)
        elif goals.primary_goal == "gain_weight":
            goal_progress = round(max(0, min(100, (current / target) * 100)), 1)
        else:
            goal_progress = 100

    return {
        "user": {
            "username": user.username if user else "",
            "email": user.email if user else ""
        },
        "profile": dict(profile._mapping) if profile else None,
        "goals": dict(goals._mapping) if goals else None,
        "bmi": bmi,
        "bmi_category": bmi_category,
        "total_calories_today": total_calories,
        "meals_today": len(meals),
        "goal_progress": goal_progress,
        "recent_metrics": [dict(m._mapping) for m in metrics]
    }