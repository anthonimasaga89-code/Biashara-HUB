from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from app.services.linkedin_service import get_linkedin_login_url, get_linkedin_access_token


router=APIRouter(
    prefix="/api/social/linked",
    tags=["LinkedIn"]
)


@router.get("/connect")
def linkedin_connect():
    url=get_linkedin_login_url()
    return RedirectResponse(url)

@router.get("/callback")
def linkedin_callback(code:str):
    token=get_linkedin_access_token(code)
    return token    