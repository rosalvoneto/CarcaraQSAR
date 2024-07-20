FROM python:3.10

ENV PYTHONUNBUFFERED=1

# Instala o JRE
RUN apt-get update && \
    apt-get install -y openjdk-11-jre && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN python3 -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "startup.sh"]
