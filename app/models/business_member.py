from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base


class BusinessMember(Base):
    """
    Model ya users wanaoshiriki kwenye business.
    """

    __tablename__ = "business_members"

    id = Column(Integer, primary_key=True, index=True)

    # Business ambayo member anashiriki
    business_id = Column(
        Integer,
        ForeignKey("businesses.id"),
        nullable=False,
        index=True
    )

    # User anayekuwa member
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Role ya member: mfano manager au staff
    role = Column(
        String(50),
        nullable=False,
        default="staff"
    )

    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )