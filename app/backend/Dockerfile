# ===== Etapa única del backend FastAPI =====
FROM python:3.11-slim
WORKDIR /app

# Instalar dependencias del sistema (wget para healthcheck)
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copiar dependencias de Python
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente
COPY . .

# Exponer el puerto del servicio
EXPOSE 80

# Comando de ejecución del servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
