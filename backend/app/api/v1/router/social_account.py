from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.schema.social_account import SocialAccountCreate
from app.services.social_account import SocialServices

router=APIRouter(
    prefix="/api/social-account",
    tags=["Social Accounts"]
)
@router.post("/{business_id}/connect")
def connect_social_account_router(
    business_id:int,
    data:SocialAccountCreate,
    db: Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    return SocialServices.connect_social_account(
        db,
        business_id,
        data,
        current_user
    )

# @router.get("/{business_id}")
# def get_business_social_account_route(
#     business_id:int,
#     db:Session=Depends(get_db),
#     current_user=Depends(get_current_user)
# ):
#     return get_business_social_accounts(
#         db,
#         business_id,
#         current_user.id
#     )


# @router.delete("/{social_account_id}")
# def disconnect_social_account_route(
#     social_account_id:int,
#     db:Session=Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     return disconnected_social_account(
#         db,
#         social_account_id,
#         current_user.id
#     )