#!/bin/bash
python manage.py migrate && python manage.py collectstatic && gunicorn --workers 2 backend.wsgi