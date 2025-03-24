from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import httpx
import jwt

from app.models.vacancy import Vacancy
from app.schemas.vacancy import (
    VacancyResponse,
    VacancyCreate,
    VacancyUpdateRequest,
)
from app.database import get_db

router = APIRouter()
security = HTTPBearer()
SECRET_KEY = "secret_key"

def safe_get(data, *keys, default=None):
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return default
    return data

def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/v1/vacancy/create/{vacancy_id}", response_model=VacancyResponse)
async def create_vacancy(
    vacancy_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    url = f"https://api.hh.ru/vacancies/{vacancy_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch vacancy data")

        data = response.json()

        new_vacancy = Vacancy(
            title=safe_get(data, "name"),
            id=int(safe_get(data, "id")),
            status=safe_get(data, "type", "id"),
            company_name=safe_get(data, "employer", "name"),
            address=safe_get(data, "employer", "logo_urls", "original"),
            logo_url=safe_get(data, "employer", "logo_urls", "original"),
            description=safe_get(data, "description")
        )

        db.add(new_vacancy)
        await db.commit()
        await db.refresh(new_vacancy)

        return new_vacancy


@router.put("/v1/vacancy/update/{vacancy_id}", response_model=VacancyResponse)
async def update_vacancy(
    vacancy_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    url = f"https://api.hh.ru/vacancies/{vacancy_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch vacancy data")

        data = response.json()

        existing_vacancy = await db.execute(
            select(Vacancy).where(Vacancy.id == int(vacancy_id))
        )
        existing_vacancy = existing_vacancy.scalar_one_or_none()

        if not existing_vacancy:
            raise HTTPException(status_code=404, detail="Vacancy not found in database")

        existing_vacancy.title = safe_get(data, "name")
        existing_vacancy.status = safe_get(data, "type", "id")
        existing_vacancy.company_name = safe_get(data, "employer", "name")
        existing_vacancy.address = safe_get(data, "employer", "logo_urls", "original")
        existing_vacancy.logo_url = safe_get(data, "employer", "logo_urls", "original")
        existing_vacancy.description = safe_get(data, "description")

        db.add(existing_vacancy)
        await db.commit()
        await db.refresh(existing_vacancy)

        return existing_vacancy


@router.patch("/v1/vacancy/update/", response_model=VacancyResponse)
async def partial_update_vacancy(
    updated_vacancy: VacancyUpdateRequest,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    existing_vacancy = await db.execute(
        select(Vacancy).where(Vacancy.id == int(updated_vacancy.id))
    )
    existing_vacancy = existing_vacancy.scalar_one_or_none()

    if not existing_vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found in database")

    if updated_vacancy.title:
        existing_vacancy.title = updated_vacancy.title
    if updated_vacancy.status:
        existing_vacancy.status = updated_vacancy.status
    if updated_vacancy.company_name:
        existing_vacancy.company_name = updated_vacancy.company_name
    if updated_vacancy.address:
        existing_vacancy.address = updated_vacancy.address
    if updated_vacancy.logo_url:
        existing_vacancy.logo_url = updated_vacancy.logo_url
    if updated_vacancy.description:
        existing_vacancy.description = updated_vacancy.description

    db.add(existing_vacancy)
    await db.commit()
    await db.refresh(existing_vacancy)

    return existing_vacancy


@router.get("/v1/vacancy/list", response_model=dict)
async def get_vacancy_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, le=100),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    offset = (page - 1) * page_size
    result = await db.execute(select(Vacancy).limit(page_size).offset(offset))
    vacancies = result.scalars().all()

    total_result = await db.execute(select(func.count()).select_from(Vacancy))
    total_vacancies = total_result.scalar_one()

    vacancy_list = [VacancyResponse.model_validate(vacancy) for vacancy in vacancies]

    return {
        "data": vacancy_list,
        "pagination": {
            "current_page": page,
            "total_pages": (total_vacancies // page_size) + (1 if total_vacancies % page_size > 0 else 0),
            "total_items": total_vacancies,
            "page_size": page_size
        }
    }


@router.get("/v1/vacancy/get/{vacancy_id}", response_model=VacancyResponse)
async def get_vacancy(
        vacancy_id: int,
        db: AsyncSession = Depends(get_db),
        user: dict = Depends(get_current_user)
):
    result = await db.execute(select(Vacancy).where(Vacancy.id == vacancy_id))
    vacancy = result.scalars().one_or_none()

    if vacancy is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    return VacancyResponse.model_validate(vacancy)


@router.delete("/v1/vacancy/delete/{vacancy_id}", status_code=204)
async def delete_vacancy(
    vacancy_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    result = await db.execute(select(Vacancy).where(Vacancy.id == vacancy_id))
    vacancy = result.scalars().one_or_none()

    if vacancy is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    await db.delete(vacancy)
    await db.commit()

    return {"detail": "Vacancy deleted successfully"}