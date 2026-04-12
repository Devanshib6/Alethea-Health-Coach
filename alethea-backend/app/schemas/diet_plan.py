from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class DietPlanCreate(BaseModel):
    title: str
    description: Optional[str] = None
    plan_json: Optional[str] = None

class DietPlanResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: Optional[str] = None
    description: Optional[str] = None
    plan_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True