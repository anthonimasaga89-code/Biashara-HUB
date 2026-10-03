from app.core.database import Base
from sqlalchemy import Column,String,Integer,DateTime,Boolean
from datetime import datetime


class User(Base):
    __tablename__="users"
    
    id=Column(Integer,primary_key=True)
    full_name=Column(String,nullable=False)
    password=Column(String,nullable=False)
    phone=Column(String,nullable=False)
    email=Column(String,unique=True,nullable=False)
    role=Column(String)
    is_active=Column(Boolean,default=True)
    created_at=Column(DateTime,default=datetime.now)
    updatetd_at=Column(DateTime,default=datetime.now,onupdate=datetime.now)