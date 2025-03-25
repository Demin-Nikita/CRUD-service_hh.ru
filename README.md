# Vacancy CRUD Service

## Запуск проекта

### **1. Клонирование репозитория**
```bash
git clone https://github.com/Demin-Nikita/CRUD-service_hh.ru.git
cd CRUD-service_hh.ru
```

### **2. Запуск через Docker**
```bash
docker-compose up --build
```
Это автоматически поднимет backend, frontend и базу данных.

---

## Локальный запуск (без Docker)

### **1. Настройка backend**
Создать виртуальное окружение и установить зависимости:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # для Linux/macOS
venv\Scripts\activate     # для Windows
pip install -r ./app/requirements.txt
```

Создать `.env` файл с настройками базы:
```
SECRET_KEY=secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
```

Запустить сервер:
```bash
uvicorn app.main:app --port 8000
```

### **2. Настройка frontend**
```bash
cd frontend
npm install
```

Создать `.env` файл с адресом api:
```
VITE_API_URL=http://localhost:8000/api
```

Запустить сервер:
```bash
npm run dev
```

После этого фронт будет доступен по `http://localhost:5173`.

---

## 📝 API документация
Когда сервер запущен, документация доступна по:
- Swagger UI: [`http://localhost:8000/docs`](http://localhost:8000/docs)
- ReDoc: [`http://localhost:8000/redoc`](http://localhost:8000/redoc)

---

