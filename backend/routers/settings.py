from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from core.dependencies import get_current_user
from core.security import get_password_hash, verify_password

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


@router.get("/")
async def get_settings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    # Get user info
    user = db.execute(
        text("SELECT * FROM users WHERE id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    # Get settings
    settings = db.execute(
        text("SELECT * FROM settings WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    # Create default settings if not exists
    if not settings:
        db.execute(
            text("""
                INSERT INTO settings (user_id, theme, units, notification_enabled, email_notifications)
                VALUES (:user_id, 'light', 'metric', true, true)
            """),
            {"user_id": user_id}
        )
        db.commit()
        settings = db.execute(
            text("SELECT * FROM settings WHERE user_id = :user_id"),
            {"user_id": user_id}
        ).fetchone()

    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
        },
        "settings": {
            "theme": settings.theme,
            "units": settings.units,
            "notification_enabled": settings.notification_enabled,
            "email_notifications": settings.email_notifications
        }
    }


@router.put("/update")
async def update_settings(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    db.execute(
        text("""
            UPDATE settings
            SET theme = :theme,
                units = :units,
                notification_enabled = :notification_enabled,
                email_notifications = :email_notifications,
                updated_at = NOW()
            WHERE user_id = :user_id
        """),
        {
            "user_id": user_id,
            "theme": data.get("theme", "light"),
            "units": data.get("units", "metric"),
            "notification_enabled": data.get("notification_enabled", True),
            "email_notifications": data.get("email_notifications", True)
        }
    )
    db.commit()
    return {"message": "Settings updated successfully"}


@router.put("/change-username")
async def change_username(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    new_username = data.get("username", "").strip()

    if not new_username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    if len(new_username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")

    # Check if username already exists
    existing = db.execute(
        text("SELECT id FROM users WHERE username = :username AND id != :user_id"),
        {"username": new_username, "user_id": user_id}
    ).fetchone()

    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")

    db.execute(
        text("UPDATE users SET username = :username WHERE id = :user_id"),
        {"username": new_username, "user_id": user_id}
    )
    db.commit()
    return {"message": "Username updated successfully"}


@router.put("/change-password")
async def change_password(
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    # Get current user
    user = db.execute(
        text("SELECT * FROM users WHERE id = :user_id"),
        {"user_id": user_id}
    ).fetchone()

    # Verify old password
    if not verify_password(data.get("old_password", ""), user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    new_password = data.get("new_password", "")
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    # Hash and update
    hashed = get_password_hash(new_password)
    db.execute(
        text("UPDATE users SET hashed_password = :password WHERE id = :user_id"),
        {"password": hashed, "user_id": user_id}
    )
    db.commit()
    return {"message": "Password changed successfully"}


@router.delete("/delete-account")
async def delete_account(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("user_id")

    # Delete all user data
    db.execute(text("DELETE FROM meals WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM health_metrics WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM diet_plans WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM health_goals WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM dietary_preferences WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM profiles WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM settings WHERE user_id = :user_id"), {"user_id": user_id})
    db.execute(text("DELETE FROM users WHERE id = :user_id"), {"user_id": user_id})
    db.commit()

    return {"message": "Account deleted successfully"}