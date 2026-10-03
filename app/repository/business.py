from sqlalchemy.orm import Session

from app.models.business import Business


class BusinessRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, business: Business) -> Business:

        self.db.add(business)
        self.db.commit()
        self.db.refresh(business)

        return business

    def get_by_id(self, business_id: int) -> Business | None:

        return (
            self.db.query(Business)
            .filter(Business.id == business_id)
            .first()
        )

    def get_by_slug(self, slug: str) -> Business | None:

        return (
            self.db.query(Business)
            .filter(Business.slug == slug)
            .first()
        )

    def get_by_owner(self, owner_id: int) -> list[Business]:

        return (
            self.db.query(Business)
            .filter(
                Business.owner_id == owner_id,
                Business.is_active.is_(True)
            )
            .all()
        )

    def update(self, business: Business) -> Business:
        
        self.db.commit()
        self.db.refresh(business)

        return business

    def delete(self, business: Business) -> Business:

        business.is_active = False

        self.db.commit()
        self.db.refresh(business)

        return business