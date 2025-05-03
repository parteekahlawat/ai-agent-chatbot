FROM python:3.10-slim

WORKDIR /app

RUN apt-get update

COPY requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app
COPY .env /app/.env

CMD ["python", "app.py"]
