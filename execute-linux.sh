#!/bin/bash

# Obtém o diretório do script
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Muda para o diretório do script
cd "$SCRIPT_DIR"

docker compose up
