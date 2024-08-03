#!/bin/sh

# Inicializa o Redis
redis-server &

# Executa as migrações do Django
python3 manage.py migrate

# Coleta os arquivos estáticos
python3 manage.py collectstatic --no-input

# Inicializa o Celery worker
celery -A backend worker -l info &

# Inicializa o Gunicorn
gunicorn --bind 0.0.0.0:8000 --workers 2 --timeout 15000 backend.wsgi
