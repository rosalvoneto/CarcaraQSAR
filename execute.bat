@echo off
REM Obtém o diretório do script
set SCRIPT_DIR=%~dp0

REM Muda para o diretório do script
cd /d %SCRIPT_DIR%

docker-compose up
pause