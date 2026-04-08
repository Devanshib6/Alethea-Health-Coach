from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.meal import Meal
from app.schemas.meal import MealCreate, MealResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=MealResponse)
def log_meal(meal_data: MealCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = Meal(**meal_data.dict(), user_id=current_user.id)
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal

@router.get("/", response_model=List[MealResponse])
def get_meals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Meal).filter(Meal.user_id == current_user.id).all()

@router.delete("/{meal_id}")
def delete_meal(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}