from sqlalchemy import Column, Integer, String, DateTime
import datetime
from .base import Base

class Vacancy(Base):
    __tablename__ = "vacancies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company_name = Column(String)
    address = Column(String)
    logo_url = Column(String, nullable=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="open")

