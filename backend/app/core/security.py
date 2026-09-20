from datetime import timedelta,datetime
from app.core.config import settings
from fastapi import HTTPException,status
from jose import jwt
from pwdlib import PasswordHash

#==================create============access=============token
def create_acess_token(data:dict):
    to_encode=data.copy()
    expire=datetime.now()+timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_TIME)
    to_encode.update({"exp":expire})
    token =jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)
    return token

def decode_token(token:str):
    payload=jwt.decode(token,settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="unauthorized")
    return payload


#==================passwaord+++++++++++++++++hashing=====================

hash_password=PasswordHash.recommended()

class Hash:
    @staticmethod
    def password_hash(password):
        return hash_password.hash(password)
    
    @staticmethod
    def verify_password(plain_password,hashed_password):
        return hash_password.verify(plain_password,hashed_password)