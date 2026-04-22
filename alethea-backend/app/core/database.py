from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Enable connection pooling with keepalive
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,          # Check connection before using
    pool_recycle=300,            # Recycle connections every 5 minutes
    pool_size=5,                 # Max connections in pool
    max_overflow=10,             # Extra connections beyond pool_size
    connect_args={
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()