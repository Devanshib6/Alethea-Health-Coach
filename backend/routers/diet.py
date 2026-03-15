from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/diet", tags=["Diet"])

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def calculate_bmr(weight, height, age, gender):
    if gender == "male":
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)


def calculate_tdee(bmr, activity_level):
    multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9
    }
    return bmr * multipliers.get(activity_level, 1.375)


def get_calorie_target(tdee, goal):
    if goal == "lose_weight":
        return tdee - 500
    elif goal == "gain_weight":
        return tdee + 500
    elif goal == "build_muscle":
        return tdee + 300
    else:
        return tdee


@router.get("/foods")
async def get_foods_by_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    foods = db.execute(
        text("""
            SELECT id, name, category, calories, protein,
            carbohydrates as carbs, fat, serving_size,
            serving_unit, cuisine_type, is_vegetarian
            FROM food_items
            WHERE category = :category
            ORDER BY name ASC
            LIMIT 20
        """),
        {"category": category}
    ).fetchall()
    return [dict(f._mapping) for f in foods]


@router.get("/search")
async def search_foods(
    query: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    # Get user dietary preference
    prefs = db.execute(
        text("SELECT diet_type FROM dietary_preferences WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    diet_type = prefs.diet_type if prefs else "omnivore"
    is_veg = diet_type in ["vegetarian", "vegan", "eggetarian", "jain", "sattvic"]

    if is_veg:
        foods = db.execute(
            text("""
                SELECT id, name, category, calories, protein,
                carbohydrates as carbs, fat, serving_size,
                serving_unit, cuisine_type, is_vegetarian
                FROM food_items
                WHERE LOWER(name) LIKE LOWER(:query)
                AND is_vegetarian = true
                ORDER BY name ASC
                LIMIT 15
            """),
            {"query": f"%{query}%"}
        ).fetchall()
    else:
        foods = db.execute(
            text("""
                SELECT id, name, category, calories, protein,
                carbohydrates as carbs, fat, serving_size,
                serving_unit, cuisine_type, is_vegetarian
                FROM food_items
                WHERE LOWER(name) LIKE LOWER(:query)
                ORDER BY name ASC
                LIMIT 15
            """),
            {"query": f"%{query}%"}
        ).fetchall()

    return [dict(f._mapping) for f in foods]


@router.get("/plan")
async def get_diet_plan(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    profile = db.execute(
        text("SELECT * FROM profiles WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    goals = db.execute(
        text("SELECT * FROM health_goals WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    prefs = db.execute(
        text("SELECT * FROM dietary_preferences WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    weight = profile.weight if profile else 65
    height = profile.height if profile else 165
    age = profile.age if profile else 25
    gender = profile.gender if profile else "male"
    activity = profile.activity_level if profile else "lightly_active"
    goal = goals.primary_goal if goals else "maintain_weight"
    diet_type = prefs.diet_type if prefs else "omnivore"
    calorie_target = goals.daily_calorie_target if goals else 2000

    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity)
    recommended_calories = get_calorie_target(tdee, goal)
    final_calorie_target = calorie_target or recommended_calories

    is_veg = diet_type in ["vegetarian", "vegan", "eggetarian", "jain", "sattvic"]

    def get_foods(category):
        if is_veg:
            foods = db.execute(
                text("""
                    SELECT id, name, category, calories, protein,
                    carbohydrates as carbs, fat, serving_size,
                    serving_unit, cuisine_type, is_vegetarian
                    FROM food_items
                    WHERE category = :category
                    AND is_vegetarian = true
                    ORDER BY RANDOM()
                    LIMIT 10
                """),
                {"category": category}
            ).fetchall()
        else:
            foods = db.execute(
                text("""
                    SELECT id, name, category, calories, protein,
                    carbohydrates as carbs, fat, serving_size,
                    serving_unit, cuisine_type, is_vegetarian
                    FROM food_items
                    WHERE category = :category
                    ORDER BY RANDOM()
                    LIMIT 10
                """),
                {"category": category}
            ).fetchall()
        return [dict(f._mapping) for f in foods]

    breakfasts = get_foods("breakfast")
    lunches = get_foods("lunch")
    dinners = get_foods("dinner")
    snacks = get_foods("snack")

    meal_plan = []
    for i in range(7):
        breakfast = breakfasts[i % len(breakfasts)] if breakfasts else {}
        lunch = lunches[i % len(lunches)] if lunches else {}
        dinner = dinners[i % len(dinners)] if dinners else {}
        snack = snacks[i % len(snacks)] if snacks else {}

        total = (
            (breakfast.get("calories", 0)) +
            (lunch.get("calories", 0)) +
            (dinner.get("calories", 0)) +
            (snack.get("calories", 0))
        )

        meal_plan.append({
            "day": DAYS[i],
            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner,
            "snack": snack,
            "total_calories": total,
            "target_calories": round(final_calorie_target),
            "status": "✅ On Target" if abs(total - final_calorie_target) < 200
                      else "⚠️ Adjust portions"
        })

    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "recommended_calories": round(recommended_calories),
        "calorie_target": round(final_calorie_target),
        "goal": goal,
        "diet_type": diet_type,
        "meal_plan": meal_plan
    }