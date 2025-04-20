<img alt="Logo" title="#Logo" src="./assets/logo.png" />

# CarcaraQSAR - Computational Algorithms to Relate Chemical Attributes with Biological Activity

CarcaraQSAR is an open-source, web-based framework designed to simplify the development of Quantitative Structure-Activity Relationship (QSAR) models. By integrating machine learning algorithms and bioinspired feature selection techniques, the platform enables researchers to efficiently identify chemical descriptors correlated with biological activity. 

Its user-friendly interface eliminates the need for extensive programming knowledge, making QSAR modeling more accessible. CarcaraQSAR supports multiple validation strategies, including cross-validation and Y-randomization, ensuring robust and reproducible models. The platform is scalable, allowing cloud deployment, and is particularly suited for applications in drug discovery and computational chemistry.

## Demonstration Video

Click the link below to watch the demonstration video.


https://www.youtube.com/watch?v=ALBr-ow9J_o


## What is a QSAR Model?

A QSAR (Quantitative Structure-Activity Relationship) model is a computational technique used in chemistry and pharmaceutical sciences to predict the biological, chemical, or toxicological properties of compounds based on their molecular structure. These models are essential in fields like drug design, toxicology, and environmental chemistry.

The general steps for building a QSAR model include:

1. **Data Collection**: Gathering molecular structure and biological activity data.
2. **Feature Selection**: Identifying relevant molecular descriptors such as molecular weight, charge distribution, and functional groups.
3. **Model Development**: Using statistical or machine learning techniques (e.g., regression, decision trees, neural networks) to create predictive models.
4. **Model Validation**: Evaluating performance using validation techniques like cross-validation and Y-randomization.
5. **Application**: Using the model to predict properties of new chemical compounds.

CarcaraQSAR automates these steps, making QSAR modeling more accessible and efficient.

## Installation Guide

CarcaraQSAR can be installed and executed locally on both **Linux** and **Windows**.

### **Linux Installation**
#### **Prerequisites**
Ensure the following dependencies are installed before proceeding:
- **Git**
- **Python + pip**
- **Node.js + npm**
- **Redis**
  
To install Redis, run:
```bash
sudo apt install redis-tools redis-server
```

#### **Installation Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/rosalvoneto/CarcaraQSAR
   cd CarcaraQSAR
   ```
   
2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup** (Open a new terminal in the current path)
   ```bash
   cd backend/backend
   python3 -m venv venv
   source venv/bin/activate  # Activate virtual environment
   pip install -r requirements.txt
   python3 manage.py migrate
   python3 manage.py runserver 0.0.0.0:8000
   ```

4. **Start Redis and Celery** (Open a new terminal in the current path)
   ```bash
   redis-server &
   celery -A backend worker -l info
   ```

5. Open your browser and access:
   ```
   http://localhost:5173/
   ```
   Create an account and start using CarcaraQSAR.

---

### **Windows Installation**

#### **1. Instalar o WSL**

Se você ainda não tem o WSL instalado, siga esses passos:

1. **Habilite o WSL e o Virtual Machine Platform**:
    - Abra o PowerShell como Administrador e execute o seguinte comando:
    
    ```powershell
    wsl --install
    ```
    
2. **Escolha a distribuição Linux**:
    - O WSL instalará o Ubuntu por padrão. Para confirmar se o Ubuntu foi instalado, execute:
    
    ```powershell
    wsl --list --verbose
    ```
    
3. **Reinicie o PC** para completar a instalação.
4. Após o reboot, **abra o Ubuntu** (ou a distribuição escolhida) e siga as instruções para configurar o nome de usuário e senha.

#### **2. Criação do script `setup_project.sh`**

Copie o script abaixo para a sua área de transferência.

```bash
#!/bin/bash

echo "======================="
echo "Setup do CarcaraQSAR"
echo "======================="

# Atualizar e instalar dependências do sistema
echo "Atualizando e instalando pacotes do sistema..."
sudo apt update
sudo apt install -y python3 python3-venv python3-pip redis-server nodejs npm git libpq-dev

# Iniciar Redis se ainda não estiver rodando
if pgrep -x "redis-server" > /dev/null; then
    echo "Redis já está rodando."
else
    echo "Iniciando Redis..."
    sudo service redis-server start
fi

# Clonar o repositório apenas se ainda não existir
if [ ! -d "CarcaraQSAR" ]; then
    echo "Clonando o repositório CarcaraQSAR..."
    git clone https://github.com/rosalvoneto/CarcaraQSAR
else
    echo "Repositório CarcaraQSAR já existe. Pulando clone."
fi

cd CarcaraQSAR

# Configuração do frontend
echo "Configurando o frontend..."
cd frontend
npm install

if pgrep -f "vite" > /dev/null; then
    echo "O servidor frontend (Vite) já está rodando."
else
    echo "Iniciando o frontend (Vite)..."
    npm run dev &>/dev/null &
fi

# Voltar para o diretório raiz do backend
cd ../backend/backend

# Criar e ativar o ambiente virtual se necessário
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
fi

echo "Ativando o ambiente virtual..."
source venv/bin/activate

# Instalar as dependências do Python
echo "Instalando dependências Python..."
pip install -r requirements.txt

# Rodar migrações do Django
echo "Aplicando migrações do Django..."
python3 manage.py migrate

# Rodar o servidor Django se não estiver rodando
if pgrep -f "runserver" > /dev/null; then
    echo "O backend Django já está rodando."
else
    echo "Iniciando o backend (Django)..."
    python3 manage.py runserver 0.0.0.0:8000 &>/dev/null &
fi

# Rodar o Celery se não estiver rodando
if pgrep -f "celery" > /dev/null; then
    echo "O Celery já está rodando."
else
    echo "Iniciando o Celery..."
    celery -A backend worker -l info &>/dev/null &
fi

# Conclusão
echo "Configuração concluída!"
echo "Frontend: http://localhost:5173/"
echo "Backend (Django): http://localhost:8000/"
```

#### **3. Passo a Passo para Usar o Script**

1. **Crie o arquivo `setup_project.sh` no diretório onde deseja rodar o projeto**:
No terminal do WSL, no diretório onde você quer que o projeto seja instalado, execute:
    
    ```bash
    touch setup_project.sh
    nano setup_project.sh
    ```
    
2. **Cole o conteúdo do script acima no arquivo `setup_project.sh`**.
3. **Torne o script executável**:
    
    No terminal do WSL, execute:
    
    ```bash
    chmod +x setup_project.sh
    ```
    
4. **Execute o script**:
    
    Ainda no terminal do WSL, execute o script com o seguinte comando:
    
    ```bash
    ./setup_project.sh
    ```
    

#### 4. Entrar no CarcaraQSAR

Agora, basta abrir o link http://localhost:5173/ no navegador e explorar o projeto!

---

## **Demonstration**

For a quick demonstration, an **online version** of CarcaraQSAR is available. However, note that this instance has **limited hardware resources** and should **not be used for large-scale projects**.

### **Access the Demo**
- **Website**: [CarcaraQSAR Demo](http://www.carcaraqsar.com.br/)
- **User**: `admin@gmail.com`
- **Password**: `admin`

To test the platform, use the dataset **F25_S50_YL.csv**, available in the root directory of the GitHub repository.

---

## **License & Citation**
CarcaraQSAR is licensed under **CC BY-NC (Creative Commons Attribution-NonCommercial)**. If you use this software in your research, please cite:

**CarcaraQSAR: A Computational Framework for Relating Chemical Descriptors to Biological Activity**  
Daniel Alencar Penha Carvalho, Rosalvo Ferreira de Oliveira Neto, Edilson B. Alencar Filho  
To be submitted to *SoftwareX*.

For more details, visit the [GitHub repository](https://github.com/rosalvoneto/CarcaraQSAR).
