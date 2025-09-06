import logging
import os
from fastapi import FastAPI
from app.routers import auth
from app.routers import contact
from app.routers import services
from app.core.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.service import Service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s"
)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth API with PostgreSQL")

# CORS: из переменной окружения CORS_ORIGINS (через запятую), иначе дефолт для dev (учитываем 5173 и 5175)
env_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
default_dev_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]
origins = env_origins if env_origins else default_dev_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contact.router, prefix="/api", tags=["Contact"])  # POST /api/contact, GET /api/leads
app.include_router(services.router, prefix="/api", tags=["Services"])  # GET /api/services

@app.get("/health")
def health():
    return {"status": "ok"}

@app.on_event("startup")
async def _log_routes():
    try:
        for r in app.routes:
            logging.info("route: %s", getattr(r, "path", str(r)))
    except Exception as e:
        logging.warning("failed to list routes: %s", e)

@app.on_event("startup")
async def _seed_default_services():
    """Если таблица service пуста, добавим 3 дефолтные услуги."""
    try:
        with SessionLocal() as db:
            exists = db.scalar(select(Service).limit(1))
            if exists:
                return
            rows = [
                Service(title="Landing за 3 дня", slug="landing-3-days", summary="Мини-лендинг под ключ: дизайн, верстка, деплой.", base_price=350, currency="USD", delivery_days=3),
                Service(title="Dockerize FastAPI + Postgres", slug="dockerize-fastapi", summary="Контейнеризация, Compose, миграции Alembic, CI-задача.", base_price=450, currency="USD", delivery_days=2),
                Service(title="n8n-автоматизация", slug="n8n-automation", summary="1–2 сценария интеграций: CRM, формы, уведомления.", base_price=300, currency="USD", delivery_days=2),
            ]
            db.add_all(rows)
            db.commit()
            logging.info("Seeded default services")
    except Exception as e:
        logging.warning("seed_default_services failed: %s", e)
