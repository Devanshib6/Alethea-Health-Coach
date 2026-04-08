from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Profile fields
    age = Column(Float, nullable=True)
    gender = Column(String, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    goal = Column(String, nullable=True)
    activity_level = Column(String, nullable=True)
    diet_type = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    
    # Additional fields for Goals & Health
    health_conditions = Column(String, nullable=True)
    sleep_hours = Column(String, nullable=True)
    stress_level = Column(Integer, nullable=True)
    
    # Additional fields for Dietary Preferences
    dislikes = Column(String, nullable=True)
    meals_per_day = Column(String, nullable=True)
    water_intake = Column(String, nullable=True)
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())