#!/bin/bash
python3 manage.py migrate
python3 manage.py collectstatic --no-input
gunicorn --bind 0.0.0.0:8000 --workers 2 --timeout 15000 backend.wsgi