from fastapi import APIRouter,Depends
from app.servises.user_services import User_services
from sqlalchemy.orm import Session
from app.core.database import get_db
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer
from app.schema.user import UserCreate,UserUpdate,UserResponse
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schema.role import RoleCheck

router=APIRouter(prefix="/user",tags=["Auth"])

oauth2_schema=OAuth2PasswordBearer(tokenUrl="/user/login")

@router.post("/register",response_model=UserResponse)
def registeruser(data:UserCreate,role:RoleCheck,db:Session=Depends(get_db)):
    return User_services.registeruser(db,data,role)

@router.post("/login")
def login(data:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    return User_services.login(db,data.username,data.password)

@router.get("/",response_model=UserResponse)
def me(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    return User_services.myinfo(db,current_user)

@router.get("/logout")
def logout(db:Session=Depends(get_db),token:str=Depends(oauth2_schema),
           current_user:User=Depends(get_current_user)):
    return User_services.logout(db,token,current_user)
    

