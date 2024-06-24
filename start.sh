#!/bin/bash

# Diretório do frontend
FRONTEND_DIR="frontend"
# Comando para iniciar o servidor de desenvolvimento do React
FRONTEND_INSTALL_CMD="npm install"
FRONTEND_START_CMD="npm run dev"

# Diretório do backend
BACKEND_DIR="backend/backend"
# Comando para iniciar o servidor de desenvolvimento do Django
BACKEND_START_CMD="python3 manage.py runserver 0.0.0.0:8000"

# Função para iniciar o frontend
start_frontend() {
  echo "Iniciando o frontend..."
  cd "$FRONTEND_DIR"
  $FRONTEND_INSTALL_CMD
  $FRONTEND_START_CMD
}

# Função para iniciar o backend
start_backend() {
  echo "Iniciando o backend..."
  cd "$BACKEND_DIR"
  pip3 install -r requirements.txt
  $BACKEND_START_CMD
}

# Inicia o frontend em um processo separado
start_frontend &
FRONTEND_PID=$!

# Inicia o backend em um processo separado
start_backend &
BACKEND_PID=$!

# Espera que os processos terminem
wait $FRONTEND_PID
wait $BACKEND_PID
