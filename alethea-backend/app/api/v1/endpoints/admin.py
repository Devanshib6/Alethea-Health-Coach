from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.meal import Meal
from app.models.health_record import HealthRecord
from app.models.diet_plan import DietPlan
from app.api.deps import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    users = db.query(User).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(
    user_id: str, 
    db: Session = Depends(get_db), 
    admin: User = Depends(require_admin)
):
    # Find the user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting your own account (to avoid lockout)
    if str(user.id) == str(admin.id):
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    
    # First, delete all related records (meals, health records, diet plans)
    db.query(Meal).filter(Meal.user_id == user.id).delete()
    db.query(HealthRecord).filter(HealthRecord.user_id == user.id).delete()
    db.query(DietPlan).filter(DietPlan.user_id == user.id).delete()
    
    # Then delete the user
    db.delete(user)
    db.commit()
    
    return {"message": f"User {user.full_name} deleted successfully"}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    admin_users = db.query(User).filter(User.role == "admin").count()
    return {
        "total_users": total_users,
        "active_users": active_users,
        "admin_users": admin_users
    }