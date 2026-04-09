from sqlalchemy import Column, Float, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    weight = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    blood_pressure = Column(String, nullable=True)
    sugar_level = Column(Float, nullable=True)
    cholesterol = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())