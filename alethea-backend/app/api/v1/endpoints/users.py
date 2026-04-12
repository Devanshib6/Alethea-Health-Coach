from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.user import UserUpdate

router = APIRouter()

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "age": current_user.age,
        "gender": current_user.gender,
        "height": current_user.height,
        "weight": current_user.weight,
        "goal": current_user.goal,
        "activity_level": current_user.activity_level,
        "diet_type": current_user.diet_type,
        "allergies": current_user.allergies
    }

@router.put("/me")
def update_me(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for field, value in data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    return {"message": "Profile updated"}

@router.delete("/me")
def delete_me(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted"}