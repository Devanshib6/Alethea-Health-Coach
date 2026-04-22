from sqlalchemy import Column, Integer, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
from datetime import date

class WaterIntake(Base):
    __tablename__ = "water_intake"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    amount_ml = Column(Integer, nullable=False)
    date = Column(Date, default=date.today)
    created_at = Column(DateTime(timezone=True), server_default=func.now())