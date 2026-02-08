FROM python:3.12-slim

WORKDIR /app
COPY dist ./dist
COPY serve.py .

CMD ["python3", "serve.py"]
