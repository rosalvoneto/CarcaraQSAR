FROM python:3.10

ENV PYTHONUNBUFFERED=1

# Instala o JRE
RUN sudo apt-get update && \
    sudo apt install default-jdk

WORKDIR /app

COPY requirements.txt .

RUN python3 -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "startup.sh"]
