<img alt="Logo" title="#Logo" src="./assets/logo.png" />

# CarcaraQSAR - Computational Algorithms to Relate Chemical Attributes with Biological Activity

CarcaraQSAR is an open-source, web-based framework designed to simplify the development of Quantitative Structure-Activity Relationship (QSAR) models. By integrating machine learning algorithms and bioinspired feature selection techniques, the platform enables researchers to efficiently identify chemical descriptors correlated with biological activity. 

Its user-friendly interface eliminates the need for extensive programming knowledge, making QSAR modeling more accessible. CarcaraQSAR supports multiple validation strategies, including cross-validation and Y-randomization, ensuring robust and reproducible models. The platform is scalable, allowing cloud deployment, and is particularly suited for applications in drug discovery and computational chemistry.

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

3. **Backend Setup** (Open a new terminal)
   ```bash
   cd backend/backend
   python3 -m venv venv
   source venv/bin/activate  # Activate virtual environment
   pip install -r requirements.txt
   python3 manage.py migrate
   python3 manage.py runserver 0.0.0.0:8000
   ```

4. **Start Redis and Celery** (Open a new terminal)
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
#### **Prerequisites**
Before installing, make sure you have:
- **Git** (https://git-scm.com/downloads)
- **Python + pip** (https://www.python.org/downloads/)
- **Node.js + npm** (https://nodejs.org/)
- **Redis** (Download from https://github.com/microsoftarchive/redis/releases)

#### **Installation Steps**
1. Open **PowerShell** as Administrator and run:
   ```powershell
   git clone https://github.com/rosalvoneto/CarcaraQSAR
   cd CarcaraQSAR
   ```

2. **Frontend Setup**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup** (Open a new terminal)
   ```powershell
   cd backend/backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```

4. **Start Redis and Celery** (Open a new terminal)
   ```powershell
   redis-server
   celery -A backend worker -l info
   ```

5. Open your browser and go to:
   ```
   http://localhost:5173/
   ```
   Register a new account and start using CarcaraQSAR.

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
Published in *SoftwareX*  

For more details, visit the [GitHub repository](https://github.com/rosalvoneto/CarcaraQSAR).
