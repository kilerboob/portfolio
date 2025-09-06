from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.models.service import Service

router = APIRouter()

@router.get("/services")
def list_services(db: Session = Depends(get_db)):
    stmt = select(Service).order_by(Service.created_at.desc())
    items = db.scalars(stmt).all()
    return [
        {
            "id": str(s.id),
            "title": s.title,
            "slug": s.slug,
            "summary": s.summary,
            "base_price": float(s.base_price) if s.base_price is not None else None,
            "currency": s.currency,
            "delivery_days": s.delivery_days,
        }
        for s in items
    ]
