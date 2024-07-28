FROM python:3.10

ENV PYTHONUNBUFFERED=1

# Instala o JRE e dos2unix
RUN apt update && \
    apt install -y default-jdk dos2unix

WORKDIR /app

COPY requirements.txt .

RUN python3 -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD sh -c "python3 manage.py migrate && python3 manage.py collectstatic --no-input && gunicorn --bind 0.0.0.0:8000 --workers 2 --timeout 15000 backend.wsgi"
