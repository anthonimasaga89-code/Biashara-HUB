from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.router import user




app=FastAPI(title=settings.APP_NAME)

app.include_router(user.router)


@app.get("/health",tags=["Health"])
def HealthCheck():
    return {
        "status":"Ok",
        "message":"welcome to Biashara Hub"
    }