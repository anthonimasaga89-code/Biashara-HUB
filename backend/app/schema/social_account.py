from pydantic import BaseModel
from typing import Optional

class SocialAccountCreate(BaseModel):
    platform :str
    account_name:str


class SocialAccountResponse(BaseModel):
    id:int
    business_id:int
    platform:str
    account_name:str
    is_connected:bool

class SocialAccountUpdate(BaseModel):
    platform :str
    account_name:str


    class config:
        from_attributes = True





