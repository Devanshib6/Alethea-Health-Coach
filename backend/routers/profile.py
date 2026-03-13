from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/profile", tags=["Profile"])

# ─── BASIC INFO ───────────────────────────────────────────
@router.post("/basic-info")
async def save_basic_info(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    # Check if profile exists
    existing = db.execute(
        text("SELECT id FROM profiles WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    if existing:
        db.execute(
            text("""
                UPDATE profiles
                SET age=:age, gender=:gender, height=:height,
                    weight=:weight, activity_level=:activity_level,
                    updated_at=NOW()
                WHERE user_id=:user_id
            """),
            {**data, "user_id": user_id}
        )
    else:
        db.execute(
            text("""
                INSERT INTO profiles
                (user_id, age, gender, height, weight, activity_level)
                VALUES (:user_id, :age, :gender, :height, :weight, :activity_level)
            """),
            {**data, "user_id": user_id}
        )
    db.commit()
    return {"message": "Basic info saved successfully"}


@router.get("/basic-info")
async def get_basic_info(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    profile = db.execute(
        text("SELECT * FROM profiles WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    if not profile:
        return {}
    return dict(profile._mapping)


# ─── HEALTH GOALS ─────────────────────────────────────────
@router.post("/goals")
async def save_goals(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    existing = db.execute(
        text("SELECT id FROM health_goals WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    if existing:
        db.execute(
            text("""
                UPDATE health_goals
                SET primary_goal=:primary_goal,
                    target_weight=:target_weight,
                    daily_calorie_target=:daily_calorie_target,
                    updated_at=NOW()
                WHERE user_id=:user_id
            """),
            {**data, "user_id": user_id}
        )
    else:
        db.execute(
            text("""
                INSERT INTO health_goals
                (user_id, primary_goal, target_weight, daily_calorie_target)
                VALUES (:user_id, :primary_goal, :target_weight, :daily_calorie_target)
            """),
            {**data, "user_id": user_id}
        )
    db.commit()
    return {"message": "Goals saved successfully"}


@router.get("/goals")
async def get_goals(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    goals = db.execute(
        text("SELECT * FROM health_goals WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    if not goals:
        return {}
    return dict(goals._mapping)


# ─── DIETARY PREFERENCES ──────────────────────────────────
@router.post("/preferences")
async def save_preferences(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    existing = db.execute(
        text("SELECT id FROM dietary_preferences WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    if existing:
        db.execute(
            text("""
                UPDATE dietary_preferences
                SET diet_type=:diet_type,
                    allergies=:allergies,
                    preferred_cuisines=:preferred_cuisines,
                    updated_at=NOW()
                WHERE user_id=:user_id
            """),
            {**data, "user_id": user_id}
        )
    else:
        db.execute(
            text("""
                INSERT INTO dietary_preferences
                (user_id, diet_type, allergies, preferred_cuisines)
                VALUES (:user_id, :diet_type, :allergies, :preferred_cuisines)
            """),
            {**data, "user_id": user_id}
        )
    db.commit()
    return {"message": "Preferences saved successfully"}


@router.get("/preferences")
async def get_preferences(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    prefs = db.execute(
        text("SELECT * FROM dietary_preferences WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    if not prefs:
        return {}
    return dict(prefs._mapping)