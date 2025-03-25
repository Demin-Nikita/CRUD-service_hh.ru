from pydantic import BaseModel
from datetime import datetime

class VacancyBase(BaseModel):
    title: str | None = None
    company_name: str | None = None
    address: str | None = None
    logo_url: str | None = None
    description: str | None = None
    status: str | None = None

class VacancyCreate(VacancyBase):
    pass

class VacancyResponse(VacancyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class VacancyUpdateRequest(BaseModel):
    id: int
    title: str | None = None
    status: str | None = None
    company_name: str | None = None
    address: str | None = None
    logo_url: str | None = None
    description: str | None = None

    class Config:
        from_attributes = True
