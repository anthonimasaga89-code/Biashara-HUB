from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.business import Business
from app.models.business_member import BusinessMember
from app.models.user import User
from app.schema.business_member import BusinessMemberCreate
from app.repository.business import BusinessRepository

class BusinessMemberService:

    def __init__(self, db: Session):
        self.db = db
        self.business_repository = BusinessRepository(db)

    def verify_owner(
        self,
        business_id: int,
        owner_id: int
    ) -> Business:

        business = self.business_repository.get_by_id(business_id)

        if not business or not business.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business not found"
            )

        if business.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the business owner can manage members"
            )

        return business

    def add_member(
        self,
        business_id: int,
        data: BusinessMemberCreate,
        owner_id: int
    ) -> BusinessMember:

        self.verify_owner(business_id, owner_id)

        user = (
            self.db.query(User)
            .filter(User.id == data.user_id)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Owner mwenyewe hahitaji kuwa member
        if data.user_id == owner_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Business owner is already the owner"
            )

        # Angalia kama user tayari ni member
        existing_member = (
            self.db.query(BusinessMember)
            .filter(
                BusinessMember.business_id == business_id,
                BusinessMember.user_id == data.user_id
            )
            .first()
        )

        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a member of this business"
            )

        # Tengeneza member mpya
        member = BusinessMember(
            business_id=business_id,
            user_id=data.user_id,
            role=data.role
        )

        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)

        return member

    def get_members(
        self,
        business_id: int,
        owner_id: int
    ) -> list[BusinessMember]:

        self.verify_owner(business_id, owner_id)

        return (
            self.db.query(BusinessMember)
            .filter(
                BusinessMember.business_id == business_id
            )
            .all()
        )

    # Remove member
    def remove_member(
        self,
        business_id: int,
        member_id: int,
        owner_id: int
    ) -> None:

        self.verify_owner(business_id, owner_id)

        member = (
            self.db.query(BusinessMember)
            .filter(
                BusinessMember.id == member_id,
                BusinessMember.business_id == business_id
            )
            .first()
        )

        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business member not found"
            )

        self.db.delete(member)
        self.db.commit()