from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from .models.base import Base

DATABASE_URL = "postgresql+asyncpg://postgres:wq3214321@localhost:5432/hh_db"

engine = create_async_engine(DATABASE_URL, echo=False)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit = False,
    autoflush=False,
    expire_on_commit=False,
)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db
