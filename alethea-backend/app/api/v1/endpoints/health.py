from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.health_record import HealthRecord
from app.api.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel
from typing import Optional

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
    record = HealthRecord(**data.dict(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/records")
def get_health_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).all()

@router.get("/predict")
def predict_health(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).order_by(HealthRecord.recorded_at).all()
    if len(records) < 2:
        return {"message": "Not enough data to predict. Please log more health records."}

    weights = [r.weight for r in records if r.weight]
    trend = "stable"
    if len(weights) >= 2:
        if weights[-1] > weights[-2]:
            trend = "increasing"
        elif weights[-1] < weights[-2]:
            trend = "decreasing"

    return {"weight_trend": trend, "latest_weight": weights[-1] if weights else None}