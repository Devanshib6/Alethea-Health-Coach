from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.health_record import HealthRecord
from app.api.deps import get_current_user
from app.models.user import User
import uuid

router = APIRouter()

@router.post("/record")
def add_record(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = HealthRecord(
        id=uuid.uuid4(),
        user_id=current_user.id,
        weight=data.get("weight"),
        blood_pressure=data.get("blood_pressure"),
        sugar_level=data.get("sugar_level"),
        cholesterol=data.get("cholesterol")
    )
    db.add(record)
    db.commit()
    return {"message": "Record added"}

@router.get("/records")
def get_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).all()

@router.get("/predict")
def predict(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(HealthRecord).filter(HealthRecord.user_id == current_user.id).all()
    if len(records) < 2:
        return {"message": "Not enough data"}
    return {"prediction": "Your health is stable"}