import os
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.service import Service

EXAMPLES = [
    {
        "title": "Landing за 3 дня",
        "slug": "landing-3-days",
        "summary": "Мини-лендинг под ключ: дизайн, верстка, деплой.",
        "base_price": 350.00,
        "currency": "USD",
        "delivery_days": 3,
    },
    {
        "title": "Dockerize FastAPI + Postgres",
        "slug": "dockerize-fastapi",
        "summary": "Контейнеризация, Compose, миграции Alembic, CI-задача.",
        "base_price": 450.00,
        "currency": "USD",
        "delivery_days": 2,
    },
    {
        "title": "n8n-автоматизация",
        "slug": "n8n-automation",
        "summary": "1–2 сценария интеграций: CRM, формы, уведомления.",
        "base_price": 300.00,
        "currency": "USD",
        "delivery_days": 2,
    },
]

def ensure_seed(db: Session) -> None:
    if db.scalar(select(Service).limit(1)):
        return
    for item in EXAMPLES:
        db.add(Service(**item))
    db.commit()
    print("✅ Seeded default services (3)")


def main():
    # only seed in non-prod or when explicitly allowed
    if os.getenv("DISABLE_SEED") == "1":
        return
    db = SessionLocal()
    try:
        ensure_seed(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
