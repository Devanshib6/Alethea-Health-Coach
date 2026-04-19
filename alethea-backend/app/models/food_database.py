from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class FoodDatabase(Base):
    __tablename__ = "food_database"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    food_name = Column(String, nullable=False, unique=True)
    category = Column(String)
    meal_type = Column(String)
    diet_type = Column(String)
    cuisine = Column(String)
    calories_per_100g = Column(Float)
    protein_per_100g = Column(Float)
    carbs_per_100g = Column(Float)
    fat_per_100g = Column(Float)
    fiber_g = Column(Float)