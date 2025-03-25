FROM python:3.9-slim

WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ENV API_URL=http://localhost:8000
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]