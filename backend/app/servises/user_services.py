from app.schema.user import UserCreate,UserUpdate
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.revokedtoken import ReVoked
from fastapi import HTTPException,status
from app.core.security import Hash,create_acess_token
from app.schema.role import RoleCheck


class User_services():
    @staticmethod
    def registeruser(db:Session,data:UserCreate,role:RoleCheck):
        existing =db.query(User).filter(User.email==data.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=f"{data.email} this email already used")
        user=User(
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            password=Hash.password_hash(data.password),
            role=role.name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        
        return user
    
    @staticmethod
    def login(db:Session,email:str,password:str):
        user=db.query(User).filter(User.email==email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="wrong email")
        if not Hash.verify_password(password,user.password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="wrong password")
        token=create_acess_token({"sub":user.email})
        return {
            "access_token":token,
            "token_type":"Bearer"
        }
    
    @staticmethod
    
    def myinfo(db:Session,current_user):
        user=db.query(User).filter(User.id==current_user.id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="access denied")
        return user
    
    @staticmethod
    def logout(db:Session,token:str,current_user):
        existing=db.query(ReVoked).filter(ReVoked.token==token).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="please login again")
        same_user=db.query(ReVoked).filter(ReVoked.user_id==current_user.id).first()
        if same_user:
            same_user.token=token
        else:
            revoked=ReVoked(
                token=token,
                user_id=current_user.id
            )
            db.add(revoked)
        db.commit()
        
        return{
            "message":"success full logged out"
        }