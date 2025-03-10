# CamPy NVR Development Guide

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- GStreamer and its development files
- Virtual environment tool (venv)

### System Dependencies (MacOS)
```bash
# Install GStreamer and plugins
brew install gstreamer gst-plugins-base gst-plugins-good gst-plugins-bad gst-plugins-ugly gst-libav

# Install Python GStreamer bindings
brew install pygobject3
```

### Project Setup
1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Unix/MacOS
   # or
   .\venv\Scripts\activate  # On Windows
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create .env file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application
1. Start the FastAPI backend:
   ```bash
   uvicorn app.backend.api.main:app --reload
   ```

2. Access the API documentation:
   - OpenAPI (Swagger): http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Development Guidelines
- Follow PEP 8 style guide for Python code
- Write tests for new features
- Update requirements.txt when adding new dependencies
- Keep the README updated with new features and changes

### Project Structure
```
app/
├── backend/
│   ├── api/          # FastAPI routes and endpoints
│   ├── services/     # Business logic and services
│   └── models/       # Database models and schemas
├── frontend/         # React frontend (to be implemented)
│   ├── src/
│   └── public/
└── tests/           # Test files
``` 