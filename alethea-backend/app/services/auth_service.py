from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

def create_user(db: Session, full_name: str, email: str, password: str):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return None
    user = User(full_name=full_name, email=email, password=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user

def generate_token(user: User) -> str:
    return create_access_token(data={"sub": str(user.id), "role": user.role})