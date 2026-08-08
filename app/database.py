from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./chat_history.db")

# Setup database engine connection
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()

# Dependency to manage database connection per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
