
from sqlalchemy import Integer, String, Column, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Business(Base):
    __tablename__="business"
    id = Column(Integer, primary_key=True,index=True)

    name = Column(String(50), nullable=False,)

    owner_id=Column(Integer, ForeignKey("users.id"), nullable=False )

    description = Column(Text, nullable=True)

    phone = Column(String(20),nullable=True)

    location = Column(String(150),nullable=True)

    status = Column(String(20), default="active", nullable=False)

    owner = relationship( "User", back_populates= "business" )

