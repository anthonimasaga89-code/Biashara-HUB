from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base



class SocialAccount(Base):
    __tablename__="social_Account"

    id = Column(Integer,primary_key=True)
    platform_name=Column(String,nullable=False)
    account_name=Column(String, nullable=False)
    is_connected=Column(Boolean, default=True)
    updated_at=Column(DateTime, 
    default=datetime.utcnow,
    onupdate=datetime.utcnow
    )
    business_id = Column(Integer,ForeignKey("business.id"))
    created_at=Column(DateTime,
    default=datetime.utcnow
    )

    business=relationship("Business",back_populates= "social")