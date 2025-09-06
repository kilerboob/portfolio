from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import text
from app.core.database import Base


class ContactMessage(Base):
    __tablename__ = "contact_message"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('uuid_generate_v4()'))
    name = Column(String(120))
    email = Column(String(160))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    source = Column(String(40), server_default='site')
    utm = Column(JSONB)
    is_read = Column(Boolean, nullable=False, server_default=text('false'))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
