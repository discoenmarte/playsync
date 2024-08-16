# Stage 1: Build the frontend
FROM node:20 AS frontend-builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Prepare the backend and serve the frontend
FROM python:3.11-slim

# Install system dependencies for Python and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install `serve` to serve static files
RUN npm install -g serve

# Set the working directory for the backend
WORKDIR /app

# Copy the Python requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend files
COPY src/ ./src

# Copy the frontend build files from the previous stage
COPY --from=frontend-builder /app/build ./build

# Expose necessary ports
EXPOSE 3000 5000

# Start the backend and serve the frontend
CMD ["sh", "-c", "python3 src/app.py & serve -s build"]
