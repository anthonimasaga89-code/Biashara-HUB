from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.service.business import BusinessService
from app.service.business_member import BusinessMemberService

from app.schema.business import (
    BusinessCreate,
    BusinessUpdate,
    BusinessResponse
);
from app.schema.business_member import (
    BusinessMemberCreate,
    BusinessMemberResponse
)


router = APIRouter(
    prefix="/businesses",
    tags=["Business Management"]
)

@router.post(
    "",
    response_model=BusinessResponse,
    status_code=status.HTTP_201_CREATED
)
def create_business(
    data: BusinessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = BusinessService(db)

    return service.create_business(
        data=data,
        owner_id=current_user.id
    )

@router.get(
    "/my",
    response_model=list[BusinessResponse]
)
def get_my_businesses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = BusinessService(db)

    return service.get_my_businesses(
        owner_id=current_user.id
    )
    
# ADD MEMBER
@router.post(
    "/{business_id}/members",
    response_model=BusinessMemberResponse,
    status_code=status.HTTP_201_CREATED
)
def add_business_member(
    business_id: int,
    data: BusinessMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    service = BusinessMemberService(db)

    return service.add_member(
        business_id=business_id,
        data=data,
        owner_id=current_user.id
    )
    
# GET MEMBERS
@router.get(
    "/{business_id}/members",
    response_model=list[BusinessMemberResponse]
)
def get_business_members(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    service = BusinessMemberService(db)

    return service.get_members(
        business_id=business_id,
        owner_id=current_user.id
    )
    
# DELETE MEMBER
@router.delete(
    "/{business_id}/members/{member_id}"
)
def remove_business_member(
    business_id: int,
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = BusinessMemberService(db)

    service.remove_member(
        business_id=business_id,
        member_id=member_id,
        owner_id=current_user.id
    )

    return {
        "message": "Business member removed successfully"
    }
    

@router.get(
    "/{business_id}",
    response_model=BusinessResponse
)
def get_business(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = BusinessService(db)

    return service.get_business(business_id)

@router.put(
    "/{business_id}",
    response_model=BusinessResponse
)
def update_business(
    business_id: int,
    data: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = BusinessService(db)

    return service.update_business(
        business_id=business_id,
        data=data,
        owner_id=current_user.id
    )

@router.delete(
    "/{business_id}",
    response_model=BusinessResponse
)
def delete_business(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = BusinessService(db)
    
    return service.delete_business(
        business_id=business_id,
        owner_id=current_user.id
    )
    