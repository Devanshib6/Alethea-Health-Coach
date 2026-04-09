import numpy as np
from sklearn.linear_model import LinearRegression

def predict_weight_trend(weights: list) -> dict:
    if len(weights) < 2:
        return {"trend": "stable", "next_predicted": None}

    x = np.array(range(len(weights))).reshape(-1, 1)
    y = np.array(weights)

    model = LinearRegression()
    model.fit(x, y)

    next_val = model.predict([[len(weights)]])[0]
    slope = model.coef_[0]

    if slope > 0.1:
        trend = "increasing"
    elif slope < -0.1:
        trend = "decreasing"
    else:
        trend = "stable"

    return {
        "trend": trend,
        "next_predicted": round(float(next_val), 2),
        "slope": round(float(slope), 4)
    }

def calculate_bmi(weight: float, height_cm: float) -> dict:
    height_m = height_cm / 100
    bmi = weight / (height_m ** 2)
    bmi = round(bmi, 2)

    if bmi < 18.5:
        category = "underweight"
    elif bmi < 25:
        category = "normal"
    elif bmi < 30:
        category = "overweight"
    else:
        category = "obese"

    return {"bmi": bmi, "category": category}

def calculate_daily_calories(weight: float, height: float, age: int, gender: str, activity: str, goal: str) -> int:
    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }

    multiplier = activity_multipliers.get(activity, 1.3)
    tdee = bmr * multiplier

    if goal in ["lose_weight", "lose weight"]:
        return int(tdee - 500)
    elif goal in ["gain_muscle", "gain muscle"]:
        return int(tdee + 300)
    else:
        return int(tdee)

def get_nutrition_recommendation(calories: int, diet_type: str) -> dict:
    if diet_type == "keto":
        protein_pct = 0.30
        carbs_pct = 0.05
        fat_pct = 0.65
    elif diet_type == "high_protein":
        protein_pct = 0.40
        carbs_pct = 0.35
        fat_pct = 0.25
    elif diet_type == "low_carb":
        protein_pct = 0.35
        carbs_pct = 0.20
        fat_pct = 0.45
    else:
        protein_pct = 0.30
        carbs_pct = 0.45
        fat_pct = 0.25

    return {
        "calories": calories,
        "protein_g": int((calories * protein_pct) / 4),
        "carbs_g": int((calories * carbs_pct) / 4),
        "fat_g": int((calories * fat_pct) / 9)
    }

def calculate_health_score(bmi: float, sugar: float, cholesterol: float) -> int:
    score = 100

    if bmi:
        if bmi < 18.5 or bmi >= 30:
            score -= 25
        elif bmi >= 25:
            score -= 10

    if sugar:
        if sugar > 200:
            score -= 30
        elif sugar > 140:
            score -= 15

    if cholesterol:
        if cholesterol > 240:
            score -= 25
        elif cholesterol > 200:
            score -= 10

    return max(0, min(100, score))