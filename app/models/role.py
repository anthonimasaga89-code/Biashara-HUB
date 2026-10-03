from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.core.database import Base


class Role(Base):

    __tablename__ = "roles"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=True
    )