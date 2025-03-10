# Use Ubuntu as base for better media handling
FROM ubuntu:22.04

WORKDIR /app

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/backend/services/recording.py /app/recording.py

# Create directory for recordings
RUN mkdir -p /app/recordings

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV RECORDINGS_PATH=/app/recordings

# Command will be specified in docker-compose
CMD ["python3", "recording.py"] 