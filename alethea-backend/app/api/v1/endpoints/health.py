from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.health_record import HealthRecord
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel
import uuid

router = APIRouter()

class HealthRecordCreate(BaseModel):
    weight: Optional[float] = None
    bmi: Optional[float] = None
    blood_pressure: Optional[str] = None
    sugar_level: Optional[float] = None
    cholesterol: Optional[float] = None
    notes: Optional[str] = None


@router.post("/record")
def add_health_record(data: HealthRecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # calculate bmi automatically if weight and height available
    bmi = data.bmi
    if not bmi and data.weight and current_user.height:
        height_m = current_user.height / 100
        bmi = round(data.weight / (height_m * height_m), 2)

    record = HealthRecord(
        id=uuid.uuid4(),
        user_id=current_user.id,
        weight=data.weight,
        bmi=bmi,
        blood_pressure=data.blood_pressure,
        sugar_level=data.sugar_level,
        cholesterol=data.cholesterol,
        notes=data.notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/records")
def get_health_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id
    ).order_by(HealthRecord.recorded_at.desc()).all()
    return records


@router.get("/predict")
def predict_health(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id
    ).order_by(HealthRecord.recorded_at.asc()).all()

    if len(records) < 2:
        return {
            "message": "Not enough data to predict. Please log at least 2 health records.",
            "prediction": None
        }

    weights = [r.weight for r in records if r.weight]
    bmis = [r.bmi for r in records if r.bmi]
    sugars = [r.sugar_level for r in records if r.sugar_level]
    cholesterols = [r.cholesterol for r in records if r.cholesterol]

    def get_trend(values):
        if len(values) < 2:
            return "stable"
        return "increasing" if values[-1] > values[-2] else "decreasing" if values[-1] < values[-2] else "stable"

    def get_bmi_category(bmi):
        if not bmi:
            return "unknown"
        if bmi < 18.5:
            return "underweight"
        elif bmi < 25:
            return "normal"
        elif bmi < 30:
            return "overweight"
        return "obese"

    latest = records[-1]
    bmi_category = get_bmi_category(latest.bmi)

    score = 100
    if bmi_category == "overweight":
        score -= 15
    elif bmi_category == "obese":
        score -= 30
    elif bmi_category == "underweight":
        score -= 10
    if latest.sugar_level and latest.sugar_level > 140:
        score -= 20
    if latest.cholesterol and latest.cholesterol > 200:
        score -= 15
    score = max(0, min(100, score))

    recommendations = []
    if bmi_category in ["overweight", "obese"]:
        recommendations.append("Consider reducing calorie intake and increasing physical activity.")
    if latest.sugar_level and latest.sugar_level > 140:
        recommendations.append("Your blood sugar is elevated. Reduce sugar and refined carbs.")
    if latest.cholesterol and latest.cholesterol > 200:
        recommendations.append("High cholesterol detected. Reduce saturated fats in your diet.")
    if not recommendations:
        recommendations.append("Your health metrics look good. Keep maintaining your current lifestyle.")

    return {
        "prediction": {
            "health_score": score,
            "bmi_category": bmi_category,
            "weight_trend": get_trend(weights),
            "bmi_trend": get_trend(bmis),
            "sugar_trend": get_trend(sugars),
            "cholesterol_trend": get_trend(cholesterols),
            "latest_weight": weights[-1] if weights else None,
            "latest_bmi": bmis[-1] if bmis else None,
            "latest_sugar": sugars[-1] if sugars else None,
            "latest_cholesterol": cholesterols[-1] if cholesterols else None,
            "recommendations": recommendations,
            "total_records": len(records)
        }
    }


@router.get("/report")
def get_health_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id
    ).order_by(HealthRecord.recorded_at.asc()).all()
    
    if not records:
        return {"message": "No health records found.", "report": None}

    return {
        "report": {
            "total_records": len(records),
            "weight_history": [{"date": str(r.recorded_at)[:10], "value": r.weight} for r in records if r.weight],
            "bmi_history": [{"date": str(r.recorded_at)[:10], "value": r.bmi} for r in records if r.bmi],
            "sugar_history": [{"date": str(r.recorded_at)[:10], "value": r.sugar_level} for r in records if r.sugar_level],
            "cholesterol_history": [{"date": str(r.recorded_at)[:10], "value": r.cholesterol} for r in records if r.cholesterol],
            "user": {
                "name": current_user.full_name,
                "age": current_user.age,
                "gender": current_user.gender,
                "goal": current_user.goal
            }
        }
    }


@router.get("/forecast")
def get_health_forecast(
    days: int = 90,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ML-based health forecasting for 30, 60, and 90 days
    Uses linear regression to predict future weight trends
    """
    # Fetch historical weight data
    records = db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id,
        HealthRecord.weight.isnot(None)
    ).order_by(HealthRecord.recorded_at.asc()).all()
    
    if len(records) < 7:
        return {
            "message": "Need at least 7 days of weight data for forecasting. Please log more health records.",
            "forecast": None
        }
    
    # Extract weights
    weights = [r.weight for r in records]
    
    # Simple linear regression for forecasting
    import numpy as np
    from sklearn.linear_model import LinearRegression
    
    x = np.array(range(len(weights))).reshape(-1, 1)
    y = np.array(weights)
    
    model = LinearRegression()
    model.fit(x, y)
    
    # Predict for next 90 days
    future_x = np.array(range(len(weights), len(weights) + days)).reshape(-1, 1)
    predictions = model.predict(future_x)
    
    # Calculate trend
    slope = model.coef_[0]
    if slope > 0.05:
        trend = "increasing"
        trend_advice = "Your weight is trending upward. Consider reducing calorie intake or increasing physical activity."
    elif slope < -0.05:
        trend = "decreasing"
        trend_advice = "Your weight is trending downward. Keep up the good work!"
    else:
        trend = "stable"
        trend_advice = "Your weight is stable. Maintain your current healthy habits."
    
    # Get predictions for specific days
    forecast_30 = predictions[29] if len(predictions) > 29 else predictions[-1]
    forecast_60 = predictions[59] if len(predictions) > 59 else predictions[-1]
    forecast_90 = predictions[89] if len(predictions) > 89 else predictions[-1]
    
    # Calculate confidence level based on data points
    confidence = 85
    if len(records) < 14:
        confidence -= 10
    if len(records) > 30:
        confidence += 5
    confidence = max(60, min(95, confidence))
    
    # Calculate weight changes
    weight_change_30 = round(forecast_30 - weights[-1], 2)
    weight_change_60 = round(forecast_60 - weights[-1], 2)
    weight_change_90 = round(forecast_90 - weights[-1], 2)
    
    # Generate forecast data points for chart (first 30 days)
    forecast_values = [round(float(predictions[i]), 2) for i in range(min(30, len(predictions)))]
    forecast_dates = [f"Day {i+1}" for i in range(len(forecast_values))]
    
    # Health risk assessment
    risks = []
    if forecast_90 > weights[-1] * 1.1:
        risks.append({
            "type": "Weight Gain",
            "severity": "High",
            "message": "Predicted weight gain of over 10% in 90 days"
        })
    elif forecast_90 < weights[-1] * 0.9:
        risks.append({
            "type": "Weight Loss",
            "severity": "Medium",
            "message": "Predicted weight loss of over 10% in 90 days"
        })
    
    if slope > 0.2:
        risks.append({
            "type": "Rapid Weight Gain",
            "severity": "High",
            "message": "Weight increasing rapidly. Consider consulting a nutritionist."
        })
    elif slope < -0.2:
        risks.append({
            "type": "Rapid Weight Loss",
            "severity": "Medium",
            "message": "Weight decreasing rapidly. Ensure you're getting adequate nutrition."
        })
    
    return {
        "forecast": {
            "current_weight": round(weights[-1], 2),
            "trend": trend,
            "trend_advice": trend_advice,
            "forecast_30_days": round(float(forecast_30), 2),
            "forecast_60_days": round(float(forecast_60), 2),
            "forecast_90_days": round(float(forecast_90), 2),
            "weight_change_30": weight_change_30,
            "weight_change_60": weight_change_60,
            "weight_change_90": weight_change_90,
            "confidence_level": confidence,
            "data_points": len(records),
            "forecast_dates": forecast_dates,
            "forecast_values": forecast_values,
            "risks": risks,
            "recommendations": [
                "Log your weight consistently for better predictions (aim for weekly entries)",
                "Maintain a balanced diet with proper macronutrients",
                "Exercise regularly for optimal health (150 minutes per week)",
                "Stay hydrated throughout the day (2.5-3 liters)",
                "Get 7-9 hours of quality sleep for better metabolism",
                "Track your meals accurately for improved calorie calculations"
            ]
        }
    }