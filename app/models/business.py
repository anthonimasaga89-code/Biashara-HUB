from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base


class Business(Base):

    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)

    # User anayemiliki biashara
    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Jina la biashara
    name = Column(String(150), nullable=False)

    # Slug ya biashara
    slug = Column(
        String(180),
        unique=True,
        nullable=False,
        index=True
    )

    category = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)

    phone = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)

    # Delivery
    delivery_available = Column(
        Boolean,
        default=False,
        nullable=False
    )

    delivery_information = Column(
        String(500),
        nullable=True
    )

    # Soft delete / deactivate
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False
    )