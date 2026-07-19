import os
import enum
from sqlalchemy import create_engine, Column, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/creditrust")

# Use SQLite fallback if postgres URL is not valid and we are running locally without docker
if "postgresql" in DATABASE_URL:
    try:
        engine = create_engine(DATABASE_URL)
    except Exception:
        DATABASE_URL = "sqlite:///./users.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class RoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.user)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
