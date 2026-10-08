from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.router import user
from app.api.v1.router import business
from app.api.v1.router import social_account
from app.api.v1.router import linkedin 
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(title=settings.APP_NAME)

app.include_router(user.router)
app.include_router(business.router)
app.include_router(social_account.router)
app.include_router(linkedin.router)




app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)


@app.get("/health",tags=["Health"])
def HealthCheck():
    return {
        "status":"Ok",
        "message":"welcome to Biashara Hub"
    }