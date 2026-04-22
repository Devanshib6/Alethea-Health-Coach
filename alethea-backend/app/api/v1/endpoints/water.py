from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.water_intake import WaterIntake
import uuid

router = APIRouter()

# Pydantic models
class WaterIntakeCreate(BaseModel):
    amount_ml: int

class WaterIntakeResponse(BaseModel):
    id: str
    user_id: str
    amount_ml: int
    date: date
    created_at: str


@router.post("/add")
def add_water_intake(
    data: WaterIntakeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add water intake record"""
    
    new_entry = WaterIntake(
        id=uuid.uuid4(),
        user_id=current_user.id,
        amount_ml=data.amount_ml,
        date=date.today()
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    return {"message": "Water intake added", "amount": data.amount_ml}


@router.get("/today")
def get_today_water(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get today's total water intake"""
    
    today_entries = db.query(WaterIntake).filter(
        WaterIntake.user_id == current_user.id,
        WaterIntake.date == date.today()
    ).all()
    
    total_ml = sum(entry.amount_ml for entry in today_entries)
    goal_ml = 2500  # Daily water goal
    
    return {
        "total_ml": total_ml,
        "goal_ml": goal_ml,
        "percentage": round((total_ml / goal_ml) * 100, 1)
    }


@router.get("/history")
def get_water_history(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get water intake history for last N days"""
    
    start_date = date.today() - timedelta(days=days)
    
    entries = db.query(WaterIntake).filter(
        WaterIntake.user_id == current_user.id,
        WaterIntake.date >= start_date
    ).all()
    
    # Group by date
    history = {}
    for entry in entries:
        if entry.date not in history:
            history[entry.date] = 0
        history[entry.date] += entry.amount_ml
    
    # Format response
    result = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        result.append({
            "date": current_date.isoformat(),
            "total_ml": history.get(current_date, 0)
        })
    
    return result