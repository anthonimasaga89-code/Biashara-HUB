from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schema.business import BusinessCreate, BusinessResponse, BusinessUpdate
from app.servises.business_service import (
    Create_business,
    delete_business as delete_business_service,
    get_business as get_business_service,
    get_my_businesses as get_my_businesses_service,
    update_business as update_business_service,
)

router = APIRouter(
    prefix="/api/businesses",
    tags=["Businesses"],
)


@router.post("/", response_model=BusinessResponse)
def create_business(
    data: BusinessCreate,
    db: Session = Depends(get_db),
    current_user:User=Depends(get_current_user),
):
    return Create_business(db, data, current_user)


@router.get("/my", response_model=list[BusinessResponse])
def get_my_businesses_route(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_my_businesses_service(db, current_user.id)


@router.get("/{business_id}", response_model=BusinessResponse)
def get_business_route(
    business_id: int,
    db: Session = Depends(get_db),
):
    return get_business_service(db, business_id)


@router.put("/{business_id}", response_model=BusinessResponse)
def update_business_route(
    business_id: int,
    data: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return update_business_service(db, business_id, data, current_user.id)


@router.delete("/{business_id}")
def delete_business_route(
    business_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return delete_business_service(db, business_id, current_user.id)

