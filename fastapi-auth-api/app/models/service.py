from sqlalchemy import Column, String, Text, Integer, Numeric, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import text
from app.core.database import Base


class Service(Base):
    __tablename__ = "service"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('uuid_generate_v4()'))
    title = Column(String(160), nullable=False)
    slug = Column(String(160), nullable=False, unique=True)
    summary = Column(String(240))
    description = Column(Text)
    base_price = Column(Numeric(12, 2))
    currency = Column(String(8), server_default='USD')
    delivery_days = Column(Integer)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)