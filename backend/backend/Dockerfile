FROM ubuntu:20.04

# Instala as dependências necessárias e o JRE
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.10 python3.10-distutils python3.10-venv openjdk-11-jre && \
    apt-get install -y curl && \
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Define a variável de ambiente
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN python3.10 -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "startup.sh"]
