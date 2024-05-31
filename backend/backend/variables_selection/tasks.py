import time
from celery import shared_task
from backend.celery import app

@app.task
def callback_sucesso(segundos):
  mensagem = f"A tarefa foi concluída com sucesso. Resultado: {segundos}"
  print(mensagem)
  return segundos

@app.task
def callback_falha(segundos):
  mensagem = f"A tarefa falhou. Exceção: {segundos}"
  print(mensagem)
  return segundos

@app.task
def tarefa_com_delay(segundos):
  print(f"Iniciando tarefa com um atraso de {segundos} segundos...")

  time.sleep(segundos)
  print("Tarefa concluída!")

  return segundos
