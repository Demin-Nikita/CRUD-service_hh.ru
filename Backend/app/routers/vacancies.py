from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from dateutil import parser
import httpx

from app.auth import get_current_user
from app.database import get_db
from app.models.vacancy import Vacancy
from app.schemas.vacancy import (
    VacancyResponse,
    VacancyCreate,
    VacancyUpdateRequest,
)

router = APIRouter()

# Utility function to safely access nested keys in a dictionary
def safe_get(data, *keys, default=None):
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return default
    return data

# Endpoint to create a new vacancy from an external API (hh.ru)
@router.post("/v1/vacancy/create/{vacancy_id}", response_model=VacancyResponse)
async def create_vacancy(
    vacancy_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    url = f"https://api.hh.ru/vacancies/{vacancy_id}"

    # Fetch vacancy data from external API
    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch vacancy data")

        data = response.json()

        # Parse and store the vacancy data in the database
        raw_created_at = safe_get(data, "created_at")
        created_at = parser.parse(raw_created_at).replace(tzinfo=None) if raw_created_at else None

        new_vacancy = Vacancy(
            title=safe_get(data, "name"),
            id=int(safe_get(data, "id")),
            status=safe_get(data, "type", "name"),
            company_name=safe_get(data, "employer", "name"),
            address=safe_get(data, "address", "raw"),
            logo_url=safe_get(data, "employer", "logo_urls", "original"),
            description=safe_get(data, "description"),
            created_at=created_at,
        )

        db.add(new_vacancy)
        await db.commit()
        await db.refresh(new_vacancy)
        return new_vacancy

# Endpoint to update an existing vacancy from external API
@router.put("/v1/vacancy/update/{vacancy_id}", response_model=VacancyResponse)
async def update_vacancy(
    vacancy_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    url = f"https://api.hh.ru/vacancies/{vacancy_id}"

    # Fetch updated vacancy data from external API
    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch vacancy data")

        data = response.json()

        # Parse the date and check if the vacancy exists in the database
        existing_vacancy = await db.execute(
            select(Vacancy).where(Vacancy.id == int(vacancy_id))
        )
        existing_vacancy = existing_vacancy.scalar_one_or_none()
        if not existing_vacancy:
            raise HTTPException(status_code=404, detail="Vacancy not found in database")

        # Update vacancy data
        raw_created_at = safe_get(data, "created_at")
        created_at = parser.parse(raw_created_at).replace(tzinfo=None) if raw_created_at else None

        existing_vacancy.title = safe_get(data, "name")
        existing_vacancy.status = safe_get(data, "type", "name")
        existing_vacancy.company_name = safe_get(data, "employer", "name")
        existing_vacancy.address = safe_get(data, "address", "raw")
        existing_vacancy.logo_url = safe_get(data, "employer", "logo_urls", "original")
        existing_vacancy.description = safe_get(data, "description")
        existing_vacancy.created_at = created_at

        db.add(existing_vacancy)
        await db.commit()
        await db.refresh(existing_vacancy)
        return existing_vacancy

# Endpoint to partially update a vacancy's fields
@router.patch("/v1/vacancy/update/", response_model=VacancyResponse)
async def partial_update_vacancy(
    updated_vacancy: VacancyUpdateRequest,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    # Check if the vacancy exists
    existing_vacancy = await db.execute(
        select(Vacancy).where(Vacancy.id == int(updated_vacancy.id))
    )
    existing_vacancy = existing_vacancy.scalar_one_or_none()
    if not existing_vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found in database")

    # Update the fields that were provided in the request
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

# Endpoint to fetch a list of vacancies with pagination
@router.get("/v1/vacancy/list", response_model=dict)
async def get_vacancy_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, le=100),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    # Calculate offset for pagination
    offset = (page - 1) * page_size
    result = await db.execute(select(Vacancy).limit(page_size).offset(offset))
    vacancies = result.scalars().all()

    # Get total number of vacancies for pagination info
    total_result = await db.execute(select(func.count()).select_from(Vacancy))
    total_vacancies = total_result.scalar_one()

    # Return vacancies with pagination details
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

# Endpoint to fetch a specific vacancy by ID
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

# Endpoint to delete a vacancy by ID
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