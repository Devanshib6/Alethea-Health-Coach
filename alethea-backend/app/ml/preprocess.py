def clean_health_records(records: list) -> list:
    cleaned = []
    for r in records:
        cleaned.append({
            "weight": float(r.weight) if r.weight else None,
            "bmi": float(r.bmi) if r.bmi else None,
            "sugar_level": float(r.sugar_level) if r.sugar_level else None,
            "cholesterol": float(r.cholesterol) if r.cholesterol else None,
            "date": str(r.recorded_at)[:10] if r.recorded_at else None
        })
    return cleaned

def normalize_value(value: float, min_val: float, max_val: float) -> float:
    if max_val == min_val:
        return 0.0
    return (value - min_val) / (max_val - min_val)

def extract_features(user) -> dict:
    return {
        "weight": user.weight or 70,
        "height": user.height or 170,
        "age": user.age or 25,
        "gender": 1 if user.gender == "male" else 0,
        "activity_level": user.activity_level or "moderate",
        "goal": user.goal or "maintain",
        "diet_type": user.diet_type or "balanced"
    }