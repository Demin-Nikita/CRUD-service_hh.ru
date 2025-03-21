from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vacancy import Vacancy
from app.main import get_db

router = APIRouter()

@router.post("/api/v1/vacancy/create")
async def create_vacancy(vacancy: Vacancy, db: AsyncSession = Depends(get_db)):
    db.add(vacancy)
    await db.commit()
    await db.refresh(vacancy)
    return vacancy

@router.get("/api/v1/vacancy/list")
async def list_vacancies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(Vacancy.__table__.select())
    return result.scalars().all()

@router.get("/api/v1/vacancy/get/{vacancy_id}")
async def get_vacancy(vacancy_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Vacancy.__table__.select().where(Vacancy.id == vacancy_id))
    vacancy = result.scalars().first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return vacancy