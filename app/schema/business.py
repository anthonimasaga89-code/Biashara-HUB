from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class BusinessCreate(BaseModel):
    name: str
    category: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    delivery_available: bool = False
    delivery_information: Optional[str] = None


class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    delivery_available: Optional[bool] = None
    delivery_information: Optional[str] = None


class BusinessResponse(BaseModel):
    id: int
    owner_id: int
    name: str
    slug: str
    category: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    delivery_available: bool
    delivery_information: Optional[str] = None

    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)