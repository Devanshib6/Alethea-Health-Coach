from fastapi import APIRouter, HTTPException, status, Depends
from schemas.auth import UserCreate, UserLogin, Token, UserOut
from core.security import get_password_hash, verify_password, create_access_token
from core.dependencies import get_current_user
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import timedelta
import os

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing_user = db.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if username exists
    existing_username = db.execute(
        text("SELECT id FROM users WHERE username = :username"),
        {"username": user.username}
    ).fetchone()

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Hash password
    hashed_password = get_password_hash(user.password)

    # Insert user
    result = db.execute(
        text("""
            INSERT INTO users (email, username, hashed_password, is_active, is_superuser)
            VALUES (:email, :username, :hashed_password, :is_active, :is_superuser)
            RETURNING id, email, username
        """),
        {
            "email": user.email,
            "username": user.username,
            "hashed_password": hashed_password,
            "is_active": True,
            "is_superuser": False
        }
    )
    db.commit()
    new_user = result.fetchone()

    # Create token
    access_token = create_access_token(
        data={
            "sub": new_user.email,
            "username": new_user.username,
            "user_id": str(new_user.id),
            "is_superuser": False
        }
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find user
    db_user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": user.email}
    ).fetchone()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create token
    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "username": db_user.username,
            "user_id": str(db_user.id),
            "is_superuser": db_user.is_superuser
        }
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user.get("sub"),
        "username": current_user.get("username"),
        "user_id": current_user.get("user_id"),
        "is_superuser": current_user.get("is_superuser")
    }