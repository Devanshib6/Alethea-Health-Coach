from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class HealthRecordCreate(BaseModel):
    weight: Optional[float] = None
    bmi: Optional[float] = None
    blood_pressure: Optional[str] = None
    sugar_level: Optional[float] = None
    cholesterol: Optional[float] = None
    notes: Optional[str] = None

class HealthRecordResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    weight: Optional[float] = None
    bmi: Optional[float] = None
    blood_pressure: Optional[str] = None
    sugar_level: Optional[float] = None
    cholesterol: Optional[float] = None
    notes: Optional[str] = None
    recorded_at: datetime

    class Config:
        from_attributes = True