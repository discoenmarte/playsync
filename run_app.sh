#!/bin/bash

# Instalar dependencias de Python
#pip install -r requirements.txt

# Instalar dependencias de Node.js
npm install

# Construir la aplicación React
npm run build

# Correr el script de Python en segundo plano
#python3 src/app.py &

# Esperar un momento para asegurar que el backend está listo
sleep 5

# Servir la aplicación React desde la carpeta build en el puerto 3000
npm start
