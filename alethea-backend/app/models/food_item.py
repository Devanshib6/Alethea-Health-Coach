from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid

class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=True)
    calories_per_100g = Column(Float, nullable=True)
    protein_per_100g = Column(Float, nullable=True)
    carbs_per_100g = Column(Float, nullable=True)
    fats_per_100g = Column(Float, nullable=True)
    fiber_per_100g = Column(Float, nullable=True)