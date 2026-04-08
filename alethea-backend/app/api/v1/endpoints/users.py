from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me")
def update_profile(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Update only the fields that are provided
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(current_user, key) and value is not None:
            setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully"}

@router.delete("/me")
def delete_account(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted"}