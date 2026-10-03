
import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.business import Business
from app.repository.business import BusinessRepository
from app.schema.business import BusinessCreate, BusinessUpdate


class BusinessService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = BusinessRepository(db)

    def generate_slug(self, name: str) -> str:
        slug = name.lower().strip()
        slug = re.sub(r"\s+", "-", slug)
        slug = re.sub(r"[^a-z0-9\-]", "", slug)
        slug = re.sub(r"-+", "-", slug)

        return slug.strip("-")

    def create_business(
        self,
        data: BusinessCreate,
        owner_id: int
    ) -> Business:

        slug = self.generate_slug(data.name)

        # Kama slug tayari ipo, ongeza namba
        original_slug = slug
        counter = 2

        while self.repository.get_by_slug(slug):
            slug = f"{original_slug}-{counter}"
            counter += 1

        # Tengeneza Business object
        business = Business(
            owner_id=owner_id,
            name=data.name,
            slug=slug,
            category=data.category,
            location=data.location,
            phone=data.phone,
            email=data.email,
            delivery_available=data.delivery_available,
            delivery_information=data.delivery_information,
            is_active=True
        )

        # Save database
        return self.repository.create(business)

    def get_business(
        self,
        business_id: int
    ) -> Business:

        business = self.repository.get_by_id(business_id)

        if not business or not business.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business not found"
            )

        return business

    # Get businesses za owner
    def get_my_businesses(
        self,
        owner_id: int
    ) -> list[Business]:

        return self.repository.get_by_owner(owner_id)

    def update_business(
        self,
        business_id: int,
        data: BusinessUpdate,
        owner_id: int
    ) -> Business:

        business = self.get_business(business_id)

        if business.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not the owner of this business"
            )

        update_data = data.model_dump(exclude_unset=True)

        # Kama jina limebadilika,
        # tengeneza slug mpya
        if "name" in update_data:
            new_name = update_data["name"]

            if new_name:
                new_slug = self.generate_slug(new_name)

                original_slug = new_slug
                counter = 2

                while True:
                    existing = self.repository.get_by_slug(new_slug)

                    if not existing or existing.id == business.id:
                        break

                    new_slug = f"{original_slug}-{counter}"
                    counter += 1

                business.slug = new_slug

        # Update fields nyingine
        for field, value in update_data.items():

            # name tayari tumeshughulikia
            if field == "name":
                business.name = value
            elif field != "slug":
                setattr(business, field, value)

        return self.repository.update(business)

    # Soft delete / deactivate Business
    def delete_business(
        self,
        business_id: int,
        owner_id: int
    ) -> Business:

        business = self.get_business(business_id)

        # Hakikisha owner ndiye anayefuta
        if business.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not the owner of this business"
            )

        # Hatu-delete record kabisa.
        # Tunaweka is_active=False.
        return self.repository.delete(business)