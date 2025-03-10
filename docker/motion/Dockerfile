# Use Python slim image with OpenCV support
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/backend/services/motion_detection.py /app/motion_detection.py

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV OPENCV_LOG_LEVEL=WARNING

# Command will be specified in docker-compose
CMD ["python", "motion_detection.py"] 