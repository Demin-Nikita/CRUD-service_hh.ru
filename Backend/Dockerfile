FROM python:3.11-slim

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y libpq-dev build-essential
RUN pip install --no-cache-dir -r ./app/requirements.txt
ENV API_URL=http://localhost:8000
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
