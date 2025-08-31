from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from passlib.hash import bcrypt
import jwt, os

SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALGO = "HS256"
ACCESS_MIN = 15
REFRESH_DAYS = 7

class User(BaseModel):
    email: EmailStr
    password: str

db = {}  # demo: in-memory


def make_token(email: str, minutes: int):
    return jwt.encode(
        {"sub": email, "exp": datetime.utcnow() + timedelta(minutes=minutes)},
        SECRET, algorithm=ALGO
    )

app = FastAPI(title="Auth API (demo)")

# --- CORS: позволяем запросы с фронта на 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    # удобный редирект на swagger
    return {"message": "See Swagger UI at /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/auth/register")
def register(u: User):
    if u.email in db:
        raise HTTPException(status_code=409, detail="User exists")
    db[u.email] = bcrypt.hash(u.password)
    return {"ok": True}

@app.post("/auth/login")
def login(u: User):
    hash_ = db.get(u.email)
    if not hash_ or not bcrypt.verify(u.password, hash_):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "access": make_token(u.email, ACCESS_MIN),
        "refresh": make_token(u.email, REFRESH_DAYS * 24 * 60),
    }
