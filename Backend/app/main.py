from fastapi import FastAPI, APIRouter, HTTPException
from .database import init_db

from .routers import vacancies

tags_metadata = [
    {"name": "Vacancies", "description": "Operations with vacancies"},
]

app = FastAPI(
    openapi_tags=tags_metadata,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(vacancies.router, tags=["Vacancies"])

app.include_router(api_router)

'''
@app.on_event("startup")
async def startup():
    await init_db()'''