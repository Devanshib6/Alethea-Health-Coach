from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/health", tags=["Health"])


def calculate_bmr(weight, height, age, gender):
    weight = float(weight)
    height = float(height)
    age = float(age)
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


def get_bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


def get_health_tips(bmi_category, goal):
    tips = {
        "Underweight": [
            "🍚 Increase calorie intake with nutrient-dense foods like nuts and dairy",
            "💪 Focus on strength training to build muscle mass",
            "🥛 Add protein-rich foods like eggs, chicken, and legumes to every meal",
            "🍌 Eat frequent small meals throughout the day",
            "😴 Get 8 hours of sleep to support healthy weight gain"
        ],
        "Normal": [
            "✅ Great job maintaining a healthy weight!",
            "🥗 Continue eating a balanced diet with plenty of vegetables",
            "🏃 Maintain your current activity level",
            "💧 Stay hydrated with 8 glasses of water daily",
            "🍎 Focus on whole foods and limit processed foods"
        ],
        "Overweight": [
            "🥗 Focus on portion control and mindful eating",
            "🏃 Aim for 30 minutes of moderate exercise daily",
            "💧 Drink water before meals to reduce appetite",
            "🚫 Limit sugar, fried foods, and processed snacks",
            "📊 Track your daily calorie intake consistently"
        ],
        "Obese": [
            "👨‍⚕️ Consult a healthcare professional for personalized advice",
            "🚶 Start with low-impact exercises like walking or swimming",
            "🥗 Replace high-calorie foods with vegetables and lean proteins",
            "💧 Drink plenty of water and avoid sugary drinks",
            "📱 Use this app to track meals and stay accountable"
        ]
    }
    return tips.get(bmi_category, tips["Normal"])


@router.get("/analysis")
async def get_health_analysis(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

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

    # Get today's meals calories
    today_calories = db.execute(
        text("""
            SELECT COALESCE(SUM(total_calories), 0) as total
            FROM meals
            WHERE user_id = :user_id
            AND DATE(created_at) = CURRENT_DATE
        """),
        {"user_id": user_id}
    ).fetchone()

    # Get last 7 days calorie data
    weekly_calories = db.execute(
        text("""
            SELECT
                DATE(created_at) as date,
                SUM(total_calories) as total_calories
            FROM meals
            WHERE user_id = :user_id
            AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        """),
        {"user_id": user_id}
    ).fetchall()

    if not profile:
        return {
            "error": "Profile not complete",
            "message": "Please complete your profile first"
        }

    # Calculate health metrics
    weight = float(profile.weight)
    height = float(profile.height)
    height_m = height / 100
    bmi = round(weight / (height_m ** 2), 1)
    bmi_category = get_bmi_category(bmi)

    age = float(profile.age)
    gender = profile.gender
    activity = profile.activity_level or "lightly_active"

    bmr = round(calculate_bmr(weight, height, age, gender))
    tdee = round(calculate_tdee(bmr, activity))

    # Goal info
    goal = goals.primary_goal if goals else "maintain_weight"
    target_weight = float(goals.target_weight) if goals and goals.target_weight else weight
    calorie_target = float(goals.daily_calorie_target) if goals and goals.daily_calorie_target else tdee

    # Weight to goal
    weight_to_goal = round(target_weight - weight, 1)

    # Today calories
    today_cal = float(today_calories.total) if today_calories else 0
    calorie_remaining = round(calorie_target - today_cal)

    # Weekly data
    weekly_data = [
        {
            "date": str(row.date),
            "calories": float(row.total_calories)
        }
        for row in weekly_calories
    ]

    # Health tips
    tips = get_health_tips(bmi_category, goal)

    # Ideal weight range
    ideal_weight_min = round(18.5 * (height_m ** 2), 1)
    ideal_weight_max = round(24.9 * (height_m ** 2), 1)

    return {
        "profile": {
            "weight": weight,
            "height": height,
            "age": int(age),
            "gender": gender,
            "activity_level": activity
        },
        "bmi": bmi,
        "bmi_category": bmi_category,
        "bmr": bmr,
        "tdee": tdee,
        "goal": goal,
        "target_weight": target_weight,
        "weight_to_goal": weight_to_goal,
        "calorie_target": round(calorie_target),
        "today_calories": round(today_cal),
        "calorie_remaining": calorie_remaining,
        "ideal_weight_min": ideal_weight_min,
        "ideal_weight_max": ideal_weight_max,
        "weekly_calories": weekly_data,
        "health_tips": tips
    }