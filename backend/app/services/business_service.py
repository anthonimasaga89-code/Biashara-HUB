from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.business import Business
from app.schema.business import BusinessCreate, BusinessUpdate


def Create_business(
    db: Session,
    data: BusinessCreate,
    current_user,
):
    business = Business(
        owner_id=current_user.id,
        name=data.name,
        description=data.description,
        phone=data.phone,
        location=data.location,
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return business


def get_my_businesses(
    db: Session,
    owner_id: int,
):
    return db.query(Business).filter(Business.owner_id == owner_id).all()


def get_business(db: Session, business_id: int):
    business = db.query(Business).filter(Business.id == business_id).first()

    if not business:
        raise HTTPException(status_code=404, detail="Business Not Found")

    return business


def update_business(
    db: Session,
    business_id: int,
    data: BusinessUpdate,
    user_id: int,
):
    business = db.query(Business).filter(Business.id == business_id).first()

    if not business:
        raise HTTPException(status_code=404, detail=f"Business with id {business_id} is not found")

    if business.owner_id != user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this business")

    
        business.name = data.name
        business.description = data.description
        business.phone = data.phone
        business.location = data.location

    db.commit()
    db.refresh(business)
    return business


def delete_business(
    db: Session,
    business_id: int,
    user_id: int,
):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business Not Found")

    if business.owner_id != user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this Business")

    db.delete(business)
    db.commit()
    return {"message": "Business deleted successfully"}

