from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Defina o Django settings module para o Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Crie uma instância do Celery
app = Celery('backend')

# Carregue as configurações do Django para o Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# Faça o Celery descobrir tarefas em todos os aplicativos Django
app.autodiscover_tasks()
