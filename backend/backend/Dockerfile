FROM python:3.10

ENV PYTHONUNBUFFERED=1

RUN apt update && \
    apt install -y default-jdk dos2unix redis-tools redis-server \
    redis-server

WORKDIR /app

COPY requirements.txt .

RUN python3 -m pip install -r requirements.txt

COPY . .

# Converte o arquivo startup.sh para o formato Unix
RUN dos2unix startup.sh

EXPOSE 8000

CMD ["sh", "startup.sh"]
