from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.business import Business
from app.models.social_account import SocialAccount
from app.schema.social_account import SocialAccountCreate,SocialAccountResponse,SocialAccountUpdate


class SocialServices():

    @staticmethod
    def connect_social_account(
        db:Session,
        business_id:int,
        data:SocialAccountCreate,current_user
    ):
        business=db.query(Business).filter(Business.id==business_id).first()

        if not business:
            raise HTTPException(
                status_code=404,
                detail="Business not fount"
            )

        if business.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail= "You are not allowed to connect social accounts to this business"
            ) 

        allowed_platforms=[
            "instagram",
            "facebook",
            "whatsapp",
            "tiktok",
            "linkedin"
            "X"
        ]

        if data.platform.lower() not in allowed_platforms:
            raise HTTPException(
                status_code=400,
                detail="Unsupported social media platform"
            )

        social_account=SocialAccount(
            business_id=business_id,
            platform_name=data.platform.lower(),
            account_name=data.account_name,
        )

        db.add(social_account)
        db.commit()
        db.refresh(social_account)
        return social_account

    def get_business_social_accounts(
        db:Session,
        business_id:int,
        user_id:int
    ):
        business= db.query(Business).filter(Business.id==business_id).first()

        if not business:
            raise HTTPException(
                status_code=404,
                detail="Business not found"
            )

        if business.owner_id != user_id:
            raise HTTPException(
                status_code =403,
                detail ="You are not allowed to view these social accounts"

            )
        accounts=db.query(SocialAccount).filter(SocialAccount.business_id == business_id).all()
        return accounts



    def disconnected_social_account(
        db:Session,
        social_account_id:int,
        user_id:int
    ):
        social_account = db.query(SocialAccount).filter(SocialAccount.id==current_user.id).first()
        if not social_account:
            raise HTTPException(
                status_code=404,
                detail="Social account not fount"
            )

        business = db.query(Business).filter(Business.id==social_account.business_id).first()


        if not business:
            raise HTTPException(
                status_code=404,
                detail="Business not found"
            )

        if business.owner_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to disconnect this account"
            )  


        social_account.is_connected=False

        db.commit()
        db.refresh(social_account)
        return{
            "message":"Social account disconnected Successful"
        }



