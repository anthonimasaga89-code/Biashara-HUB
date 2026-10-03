from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BusinessMemberCreate(BaseModel):
    user_id: int
    role: str = "staff"


class BusinessMemberResponse(BaseModel):
    id: int
    business_id: int
    user_id: int
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)