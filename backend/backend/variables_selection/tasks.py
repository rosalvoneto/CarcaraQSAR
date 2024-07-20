import time
from celery import shared_task
from backend.celery import app

@app.task
def callback_sucesso(segundos):
  mensagem = f"A tarefa foi concluída com sucesso. Resultado: {segundos}"
  return segundos

@app.task
def callback_falha(segundos):
  mensagem = f"A tarefa falhou. Exceção: {segundos}"
  return segundos

@app.task
def tarefa_com_delay(segundos):
  time.sleep(segundos)
  return segundos
