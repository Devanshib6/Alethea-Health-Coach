from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.meal import Meal
from app.schemas.meal import MealCreate, MealResponse
from app.api.deps import get_current_user
from app.models.user import User
from datetime import date
import uuid

router = APIRouter()

@router.post("/", response_model=MealResponse)
def log_meal(meal_data: MealCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = Meal(
        id=uuid.uuid4(),
        user_id=current_user.id,
        food_name=meal_data.food_name,
        meal_type=meal_data.meal_type,
        calories=meal_data.calories,
        protein=meal_data.protein,
        carbs=meal_data.carbs,
        fat=meal_data.fat,
        quantity=meal_data.quantity,
        unit=meal_data.unit,
        date=date.today()
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    
    # Convert date to string for response
    response_data = MealResponse(
        id=meal.id,
        user_id=meal.user_id,
        food_name=meal.food_name,
        meal_type=meal.meal_type,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat,
        quantity=meal.quantity,
        unit=meal.unit,
        date=str(meal.date) if meal.date else None,
        created_at=meal.created_at
    )
    return response_data

@router.get("/", response_model=List[MealResponse])
def get_meals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meals = db.query(Meal).filter(Meal.user_id == current_user.id).order_by(Meal.created_at.desc()).all()
    
    # Convert date to string for each meal
    response_data = []
    for meal in meals:
        response_data.append(MealResponse(
            id=meal.id,
            user_id=meal.user_id,
            food_name=meal.food_name,
            meal_type=meal.meal_type,
            calories=meal.calories,
            protein=meal.protein,
            carbs=meal.carbs,
            fat=meal.fat,
            quantity=meal.quantity,
            unit=meal.unit,
            date=str(meal.date) if meal.date else None,
            created_at=meal.created_at
        ))
    return response_data

@router.delete("/{meal_id}")
def delete_meal(meal_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}