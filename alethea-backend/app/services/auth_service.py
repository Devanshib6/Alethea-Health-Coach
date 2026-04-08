from app.db.database import get_db
from app.core.security import get_password_hash, verify_password
from app.schemas.user import UserCreate
from fastapi import HTTPException, status
from datetime import datetime

class AuthService:
    def __init__(self):
        self.db = get_db()
    
    def register_user(self, user_data: UserCreate):
        # Check if user exists
        existing = self.db.table("users").select("*").eq("email", user_data.email).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        password_hash = get_password_hash(user_data.password)
        user_result = self.db.table("users").insert({
            "email": user_data.email,
            "password_hash": password_hash,
            "role": "user"
        }).execute()
        
        if not user_result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        user = user_result.data[0]
        
        # Create default profile
        self.db.table("profiles").insert({
            "user_id": user["id"]
        }).execute()
        
        return {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"]
        }
    
    def authenticate_user(self, email: str, password: str):
        user_result = self.db.table("users").select("*").eq("email", email).execute()
        
        if not user_result.data:
            return None
        
        user = user_result.data[0]
        
        if not verify_password(password, user["password_hash"]):
            return None
        
        return {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"]
        }