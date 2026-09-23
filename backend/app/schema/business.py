from pydantic import BaseModel


class BusinessCreate(BaseModel):
    name: str
    description: str | None = None
    phone: str | None = None
    location: str | None = None


class BusinessUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    phone: str | None = None
    location: str | None = None


class BusinessResponse(BaseModel):
    id: int
    owner_id: int
    name: str
    description: str | None = None
    phone: str | None = None
    location: str | None = None
    status: str

    class Config:
        from_attributes = True