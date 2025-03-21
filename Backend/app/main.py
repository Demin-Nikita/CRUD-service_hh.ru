from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
import datetime

DATABASE_URL = "postgresql+psycopg2://user:password@localhost/hh_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Определение модели вакансии
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

# Создаем таблицы
Base.metadata.create_all(bind=engine)

# Dependency для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/v1/vacancy/create")
def create_vacancy(vacancy: Vacancy, db: Session = Depends(get_db)):
    db.add(vacancy)
    db.commit()
    db.refresh(vacancy)
    return vacancy

@app.get("/api/v1/vacancy/list")
def list_vacancies(db: Session = Depends(get_db)):
    return db.query(Vacancy).all()

@app.get("/api/v1/vacancy/get/{vacancy_id}")
def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return vacancy
