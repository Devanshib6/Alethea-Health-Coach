from app.services.ml_service import predict_weight_trend, calculate_bmi, calculate_daily_calories, get_nutrition_recommendation, calculate_health_score

def run_health_prediction(records: list) -> dict:
    if not records:
        return {"error": "No records provided"}
    weights = [r.get("weight") for r in records if r.get("weight")]
    weight_pred = predict_weight_trend(weights) if len(weights) >= 2 else {"trend": "stable", "next_predicted": None}
    latest = records[-1]
    score = calculate_health_score(bmi=latest.get("bmi"), sugar=latest.get("sugar_level"), cholesterol=latest.get("cholesterol"))
    return {"health_score": score, "weight_prediction": weight_pred, "latest": latest}

def run_nutrition_prediction(user_data: dict) -> dict:
    calories = calculate_daily_calories(
        weight=user_data.get("weight", 70),
        height=user_data.get("height", 170),
        age=user_data.get("age", 25),
        gender=user_data.get("gender", "male"),
        activity=user_data.get("activity_level", "moderate"),
        goal=user_data.get("goal", "maintain")
    )
    return get_nutrition_recommendation(calories=calories, diet_type=user_data.get("diet_type", "balanced"))