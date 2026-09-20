from app.core.database import Base
from sqlalchemy import Column,String,Integer,DateTime
from datetime import datetime

class ReVoked(Base):
    
    __tablename__="revoked"
    
    id=Column(Integer,primary_key=True)
    user_id=Column(Integer,nullable=False)
    token=Column(String,nullable=False)
    revoked_at=Column(DateTime,default=datetime.now)