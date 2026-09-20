from app.core.security import decode_token
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.revokedtoken import ReVoked
from app.core.database import get_db

oauth2schema=OAuth2PasswordBearer(tokenUrl="/user/login")


def get_current_user(token:str=Depends(oauth2schema),
                     db:Session=Depends(get_db)):
    revokes=db.query(ReVoked).filter(ReVoked.token==token).first()
    if revokes:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="please login again")
    payload=decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="invalid credentials")
    email=payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="invalid or expire token")
    user=db.query(User).filter(User.email==email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"{email} this email not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="user account not active")
    return user