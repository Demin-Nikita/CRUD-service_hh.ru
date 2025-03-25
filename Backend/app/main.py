from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import vacancies
from .routers import users

# Metadata for OpenAPI docs to categorize the routes
tags_metadata = [
    {"name": "Vacancies", "description": "Operations with vacancies"},
    {"name": "Users", "description": "Operations with users"},
]

# FastAPI app instance
app = FastAPI(
    openapi_tags=tags_metadata,
)

# Middleware to handle CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers configuration
api_router = APIRouter(prefix="/api")
api_router.include_router(vacancies.router, tags=["Vacancies"])
api_router.include_router(users.router, tags=["Users"])
app.include_router(api_router)

# Startup event to initialize the database when the app starts
@app.on_event("startup")
async def startup():
    await init_db()