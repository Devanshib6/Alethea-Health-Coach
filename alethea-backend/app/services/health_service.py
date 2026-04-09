from sqlalchemy.orm import Session
from app.models.health_record import HealthRecord
from app.services.ml_service import predict_weight_trend, calculate_health_score
import uuid

def add_health_record(db: Session, user_id, weight=None, bmi=None, blood_pressure=None, sugar_level=None, cholesterol=None, notes=None):
    record = HealthRecord(
        id=uuid.uuid4(),
        user_id=user_id,
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
    return record

def get_health_records(db: Session, user_id):
    return db.query(HealthRecord).filter(HealthRecord.user_id == user_id).order_by(HealthRecord.recorded_at.asc()).all()

def get_health_prediction(db: Session, user_id):
    records = get_health_records(db, user_id)
    if len(records) < 2:
        return None

    weights = [r.weight for r in records if r.weight]
    weight_prediction = predict_weight_trend(weights) if len(weights) >= 2 else {"trend": "stable", "next_predicted": None}

    latest = records[-1]
    health_score = calculate_health_score(
        bmi=latest.bmi,
        sugar=latest.sugar_level,
        cholesterol=latest.cholesterol
    )

    return {
        "health_score": health_score,
        "weight_prediction": weight_prediction,
        "latest_weight": latest.weight,
        "latest_bmi": latest.bmi,
        "latest_sugar": latest.sugar_level,
        "latest_cholesterol": latest.cholesterol,
        "total_records": len(records)
    }