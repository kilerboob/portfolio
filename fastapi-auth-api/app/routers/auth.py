from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from app.schemas.user import UserCreate, Token
from app.models.user import User
from app.core.database import SessionLocal
from datetime import datetime, timedelta
import os, jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALGO = "HS256"
ACCESS_MIN = 15
REFRESH_DAYS = 7

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def make_token(email: str, minutes: int):
    return jwt.encode(
        {"sub": email, "exp": datetime.utcnow() + timedelta(minutes=minutes)},
        SECRET,
        algorithm=ALGO
    )

@router.post("/register")
def register(u: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == u.email).first()
    if exists:
        raise HTTPException(status_code=409, detail="User exists")
    user = User(email=u.email, hashed_password=bcrypt.hash(u.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"ok": True}

@router.post("/login", response_model=Token)
def login(u: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == u.email).first()
    if not user or not bcrypt.verify(u.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "access": make_token(user.email, ACCESS_MIN),
        "refresh": make_token(user.email, REFRESH_DAYS * 24 * 60),
    }
