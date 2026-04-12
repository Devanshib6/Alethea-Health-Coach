from sqlalchemy.orm import Session
from app.models.meal import Meal
from datetime import date
import uuid

def create_meal(db, user_id, food_name, meal_type, calories=None, protein=None, carbs=None, fat=None, quantity=None, unit=None):
    meal = Meal(id=uuid.uuid4(), user_id=user_id, food_name=food_name, meal_type=meal_type, calories=calories, protein=protein, carbs=carbs, fat=fat, quantity=quantity, unit=unit, date=date.today())
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal

def get_user_meals(db: Session, user_id):
    return db.query(Meal).filter(Meal.user_id == user_id).order_by(Meal.created_at.desc()).all()

def delete_meal(db: Session, meal_id, user_id):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == user_id).first()
    if meal:
        db.delete(meal)
        db.commit()
        return True
    return False

def get_daily_nutrition(db: Session, user_id, target_date=None):
    if not target_date:
        target_date = date.today()
    meals = db.query(Meal).filter(Meal.user_id == user_id, Meal.date == target_date).all()
    total = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    for meal in meals:
        total["calories"] += meal.calories or 0
        total["protein"] += meal.protein or 0
        total["carbs"] += meal.carbs or 0
        total["fat"] += meal.fat or 0
    return total