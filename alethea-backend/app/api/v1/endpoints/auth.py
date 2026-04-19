from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

router = APIRouter()

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Get role from request, default to 'user'
    role = user_data.role if user_data.role in ["user", "admin"] else "user"
    
    # Create new user - NOW WITH PASSWORD FIELD
    new_user = User(
        id=uuid.uuid4(),
        full_name=user_data.full_name,
        email=user_data.email,
        password=hash_password(user_data.password),  # This now works
        role=role,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Account created successfully",
        "user_id": str(new_user.id),
        "role": new_user.role
    }

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    
    # Check if user exists and password is correct
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is deactivated")
    
    # Create access token
    token = create_access_token(data={
        "sub": str(user.id),
        "email": user.email,
        "role": user.role
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "role": user.role
    }

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}