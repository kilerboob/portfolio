from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.contact_message import ContactMessage
from app.utils.telegram import send_telegram_message, send_auto_reply_to_user
import anyio
from sqlalchemy import select

router = APIRouter()

class ContactForm(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=200)
    message: str = Field(min_length=5, max_length=5000)
    source: str = "site"
    utm: dict[str, str] | None = None
    telegram_chat_id: str | None = None

@router.post("/contact")
def create_contact(form: ContactForm, db: Session = Depends(get_db)):
    # Записываем только поддерживаемые полями модели значения
    payload = form.model_dump()
    msg = ContactMessage(
        name=payload["name"],
        email=payload["email"],
        subject=payload["subject"],
        message=payload["message"],
        source=payload.get("source", "site"),
        utm=payload.get("utm"),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    text = (
        f"📩 Новая заявка\n"
        f"👤 {form.name}\n"
        f"📧 {form.email}\n"
        f"📝 {form.subject}\n"
        f"💬 {form.message}"
    )
    # Вызов async-отправки из sync-ручки
    anyio.run(send_telegram_message, text)
    user_chat = payload.get("telegram_chat_id")
    if user_chat:
        # fire and forget auto-reply to user
        anyio.run(send_auto_reply_to_user, user_chat, form.name)

    return {"message": "Заявка успешно отправлена"}


@router.get("/leads")
def list_leads(db: Session = Depends(get_db)):
    rows = db.scalars(select(ContactMessage).order_by(ContactMessage.created_at.desc())).all()
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "email": r.email,
            "subject": r.subject,
            "message": r.message,
            "is_read": r.is_read,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
    ]
