from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from httpx import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import httpx

from app.models.vacancy import Vacancy
from app.schemas.vacancy import (
    VacancyResponse,
    VacancyCreate,
)
from app.database import get_db


router = APIRouter()


@router.post("/v1/vacancy/create/{vacancy_id}", response_model=VacancyResponse)
async def create_vacancy(vacancy_id: str, db: AsyncSession = Depends(get_db)):
    url = f"https://api.hh.ru/vacancies/{vacancy_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch vacancy data")

        data = response.json()

        new_vacancy = Vacancy(
            title=data.get("name"),
            id=int(data.get("id")),
            status=data.get("type", {}).get("id"),
            company_name=data.get("employer", {}).get("name"),
            address=data.get("address", {}).get("raw"),
            logo_url=data.get("employer", {}).get("logo_urls", {}).get("original"),
            description=data.get("description")
        )

        db.add(new_vacancy)
        await db.commit()
        await db.refresh(new_vacancy)

        return new_vacancy


@router.put("/v1/vacancy/update/{vacancy_id}", response_model=VacancyResponse)
async def update_vacancy(vacancy_id: str, db: AsyncSession = Depends(get_db)):
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

        existing_vacancy.title = data.get("name")
        existing_vacancy.status = data.get("type", {}).get("id")
        existing_vacancy.company_name = data.get("employer", {}).get("name")
        existing_vacancy.address = data.get("address", {}).get("raw")
        existing_vacancy.logo_url = data.get("employer", {}).get("logo_urls", {}).get("original")
        existing_vacancy.description = data.get("description")

        db.add(existing_vacancy)
        await db.commit()
        await db.refresh(existing_vacancy)

        return existing_vacancy


@router.patch("/v1/vacancy/update/{vacancy_id}", response_model=VacancyResponse)
async def partial_update_vacancy(vacancy_id: str, db: AsyncSession = Depends(get_db)):
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

        if "name" in data:
            existing_vacancy.title = data.get("name")
        if "type" in data and "id" in data["type"]:
            existing_vacancy.status = data.get("type", {}).get("id")
        if "employer" in data and "name" in data["employer"]:
            existing_vacancy.company_name = data.get("employer", {}).get("name")
        if "address" in data and "raw" in data["address"]:
            existing_vacancy.address = data.get("address", {}).get("raw")
        if "employer" in data and "logo_urls" in data["employer"]:
            existing_vacancy.logo_url = data.get("employer", {}).get("logo_urls", {}).get("original")
        if "description" in data:
            existing_vacancy.description = data.get("description")

        db.add(existing_vacancy)
        await db.commit()
        await db.refresh(existing_vacancy)

        return existing_vacancy


@router.get("/v1/vacancy/list", response_model=list[VacancyResponse])
async def get_vacancy_list(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vacancy))
    vacancies = result.scalars().all()
    vacancy_list = [VacancyResponse.model_validate(vacancy) for vacancy in vacancies]
    return vacancy_list


@router.get("/v1/vacancy/get/{vacancy_id}", response_model=VacancyResponse)
async def get_vacancy(vacancy_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vacancy).where(Vacancy.id == vacancy_id))
    vacancy = result.scalars().one_or_none()

    if vacancy is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    return VacancyResponse.model_validate(vacancy)


@router.delete("/v1/vacancy/delete/{vacancy_id}", status_code=204)
async def delete_vacancy(vacancy_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vacancy).where(Vacancy.id == vacancy_id))
    vacancy = result.scalars().one_or_none()

    if vacancy is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    await db.delete(vacancy)
    await db.commit()

    return {"detail": "Vacancy deleted successfully"}