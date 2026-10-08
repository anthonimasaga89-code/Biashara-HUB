import requests
from urllib.parse import urlencode
from app.core.config import settings



def get_linkedin_login_url():

    params={
        "response_type":"code",
        "client_id":settings.REDIRECT_CLIENT_URL,
        "scope":"opened profile email",
    }

    url= "https://www.linkedin.com/oauth/v2/authorization"

    return (url+"?"+urlencode(params))


def get_linkedin_access_token(code):
    
    response=requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",

    data={
        "grant_type":"authorization_code",
        "code":settings.CLIENT_ID,
        "client_secret":settings.CLIENT_SECRET,
        "redirect_url":settings.REDIRECT_CLIENT_URL
    },
    timeout=30
     )
    response.raise_for_status() 
    return response.json()
