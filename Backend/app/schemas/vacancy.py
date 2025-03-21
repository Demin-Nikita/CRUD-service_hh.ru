from pydantic import BaseModel, field_validator
from datetime import datetime

class VacancyBase(BaseModel):
    title: str
    company_name: str
    address: str
    logo_url: str | None = None
    description: str
    status: str

class VacancyCreate(VacancyBase):
    pass

class VacancyResponse(VacancyBase):
    id: int
    created_at: datetime

    @field_validator("created_at")
    def validate_created_at(cls, value: datetime):
        if value > datetime.now():
            raise ValueError("Creation date cannot be in the future")
        return value

    class Config:
        from_attributes = True
