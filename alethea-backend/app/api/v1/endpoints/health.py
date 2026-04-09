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
    sugar_levels = [r.sugar_level for r in records if r.sugar_level]
    cholesterols = [r.cholesterol for r in records if r.cholesterol]

    def get_trend(values):
        if len(values) < 2:
            return "stable"
        if values[-1] > values[-2]:
            return "increasing"
        elif values[-1] < values[-2]:
            return "decreasing"
        return "stable"

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

    # generate health score out of 100
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

    # generate recommendations
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
            "sugar_trend": get_trend(sugar_levels),
            "cholesterol_trend": get_trend(cholesterols),
            "latest_weight": weights[-1] if weights else None,
            "latest_bmi": bmis[-1] if bmis else None,
            "latest_sugar": sugar_levels[-1] if sugar_levels else None,
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

    weights = [{"date": str(r.recorded_at)[:10], "value": r.weight} for r in records if r.weight]
    bmis = [{"date": str(r.recorded_at)[:10], "value": r.bmi} for r in records if r.bmi]
    sugars = [{"date": str(r.recorded_at)[:10], "value": r.sugar_level} for r in records if r.sugar_level]
    cholesterols = [{"date": str(r.recorded_at)[:10], "value": r.cholesterol} for r in records if r.cholesterol]

    return {
        "report": {
            "total_records": len(records),
            "weight_history": weights,
            "bmi_history": bmis,
            "sugar_history": sugars,
            "cholesterol_history": cholesterols,
            "user": {
                "name": current_user.full_name,
                "age": current_user.age,
                "gender": current_user.gender,
                "goal": current_user.goal
            }
        }
    }