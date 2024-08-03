#!/bin/sh

# Inicializa o Redis
redis-server &

# Inicializa o servidor Django
python3 manage.py migrate
python3 manage.py collectstatic --no-input
gunicorn --bind 0.0.0.0:8000 --workers 2 --timeout 15000 backend.wsgi

# Inicializa o Celery worker
celery -A backend worker -l info