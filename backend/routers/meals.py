from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/meals", tags=["Meals"])

@router.post("/add")
async def add_meal(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    db.execute(
        text("""
            INSERT INTO meals
            (user_id, meal_type, meal_name, total_calories,
             total_protein, total_carbs, total_fat, notes)
            VALUES
            (:user_id, :meal_type, :meal_name, :total_calories,
             :total_protein, :total_carbs, :total_fat, :notes)
        """),
        {
            "user_id": user_id,
            "meal_type": data.get("meal_type"),
            "meal_name": data.get("meal_name"),
            "total_calories": data.get("total_calories", 0),
            "total_protein": data.get("total_protein", 0),
            "total_carbs": data.get("total_carbs", 0),
            "total_fat": data.get("total_fat", 0),
            "notes": data.get("notes", "")
        }
    )
    db.commit()
    return {"message": "Meal added successfully"}


@router.get("/today")
async def get_today_meals(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    meals = db.execute(
        text("""
            SELECT * FROM meals
            WHERE user_id = :user_id
            AND DATE(meal_date) = CURRENT_DATE
            ORDER BY meal_date DESC
        """),
        {"user_id": user_id}
    ).fetchall()
    return [dict(m._mapping) for m in meals]


@router.get("/history")
async def get_meal_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    meals = db.execute(
        text("""
            SELECT * FROM meals
            WHERE user_id = :user_id
            ORDER BY meal_date DESC
            LIMIT 30
        """),
        {"user_id": user_id}
    ).fetchall()
    return [dict(m._mapping) for m in meals]


@router.delete("/{meal_id}")
async def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    db.execute(
        text("DELETE FROM meals WHERE id = :meal_id AND user_id = :user_id"),
        {"meal_id": meal_id, "user_id": user_id}
    )
    db.commit()
    return {"message": "Meal deleted successfully"}