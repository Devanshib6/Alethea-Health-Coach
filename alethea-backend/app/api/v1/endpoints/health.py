from fastapi import APIRouter, Depends, HTTPException
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
def add_health_record(
    data: HealthRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Convert empty strings to None for numeric fields
        weight = data.weight if data.weight not in [None, ""] else None
        sugar_level = data.sugar_level if data.sugar_level not in [None, ""] else None
        cholesterol = data.cholesterol if data.cholesterol not in [None, ""] else None
        blood_pressure = data.blood_pressure if data.blood_pressure not in [None, ""] else None
        notes = data.notes if data.notes not in [None, ""] else None
        
        # Calculate BMI if weight provided and user has height
        bmi = data.bmi
        if not bmi and weight and current_user.height:
            height_m = current_user.height / 100
            bmi = round(weight / (height_m * height_m), 2)
        
        record = HealthRecord(
            id=uuid.uuid4(),
            user_id=current_user.id,
            weight=weight,
            bmi=bmi,
            blood_pressure=blood_pressure,
            sugar_level=sugar_level,
            cholesterol=cholesterol,
            notes=notes
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        return {"message": "Health record added successfully", "record": record}
        
    except Exception as e:
        db.rollback()
        print(f"Error adding health record: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/records")
def get_health_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id
    ).order_by(HealthRecord.recorded_at.desc()).all()
    return records

@router.get("/predict")
def predict_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(HealthRecord).filter(
        HealthRecord.user_id == current_user.id
    ).order_by(HealthRecord.recorded_at.asc()).all()
    
    if len(records) < 2:
        return {
            "message": "Not enough data. Please log at least 2 health records.",
            "prediction": None
        }
    
    # Get weight trend
    weights = [r.weight for r in records if r.weight]
    if len(weights) >= 2:
        if weights[-1] > weights[-2]:
            weight_trend = "increasing"
        elif weights[-1] < weights[-2]:
            weight_trend = "decreasing"
        else:
            weight_trend = "stable"
    else:
        weight_trend = "stable"
    
    # Get BMI category
    latest = records[-1]
    bmi_category = "unknown"
    if latest.bmi:
        if latest.bmi < 18.5:
            bmi_category = "underweight"
        elif latest.bmi < 25:
            bmi_category = "normal"
        elif latest.bmi < 30:
            bmi_category = "overweight"
        else:
            bmi_category = "obese"
    
    # Calculate health score
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
    
    # Generate recommendations
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
            "weight_trend": weight_trend,
            "latest_weight": weights[-1] if weights else None,
            "latest_bmi": latest.bmi,
            "latest_sugar": latest.sugar_level,
            "latest_cholesterol": latest.cholesterol,
            "recommendations": recommendations,
            "total_records": len(records)
        }
    }

@router.get("/report")
def get_health_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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