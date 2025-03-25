from sqlalchemy import Column, Integer, String, DateTime
from .base import Base

# Vacancy model that represents the vacancies table in the database
class Vacancy(Base):
    __tablename__ = "vacancies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company_name = Column(String)
    address = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    description = Column(String)
    created_at = Column(DateTime)
    status = Column(String, default="open")

