from pydantic import BaseModel,EmailStr,ConfigDict
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    full_name:str
    phone:str="0618982523"
    email:EmailStr
    password:str
    
class UserUpdate(BaseModel):
    full_name:Optional[str]=None
    phone:Optional[str]=None
    email:Optional[EmailStr]=None
    password:Optional[str]=None
    
    
class UserResponse(BaseModel):
    id:int
    full_name:str
    phone:str
    email:EmailStr
    role:str
    created_at:datetime
    updatetd_at:datetime
    
    model_config=ConfigDict(
        from_attributes=True
    )
 