# Use Ubuntu as base for better GStreamer support
FROM ubuntu:22.04

WORKDIR /app

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    pkg-config \
    libcairo2-dev \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    python3-gst-1.0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/backend/services/rtsp_handler.py /app/rtsp_handler.py

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV GST_DEBUG=2

# Command will be specified in docker-compose
CMD ["python3", "rtsp_handler.py"] 