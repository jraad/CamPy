# CamPy RTSP Streaming Application

A modern web application for viewing RTSP video streams using FastAPI and React.

## Project Structure

```
CamPy/
├── backend/           # Python FastAPI backend
│   ├── app/
│   │   ├── main.py   # FastAPI application
│   │   ├── routes/   # API endpoints
│   │   └── services/ # Business logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## Prerequisites

- Docker and Docker Compose
- An RTSP stream source (camera, video server, etc.)

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CamPy
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

To stop the application:
```bash
docker-compose down
```

## Manual Setup (Development)

If you prefer to run the application without Docker, follow these steps:

### Backend Setup

1. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Open your web browser and navigate to `http://localhost:3000`
2. Enter your RTSP URL in the input field (e.g., `rtsp://username:password@camera-ip:554/stream1`)
3. Click "Connect" to start viewing the stream
4. Click "Disconnect" to stop the stream

## API Endpoints

- `POST /api/stream/connect` - Connect to an RTSP stream
- `GET /api/stream/stream/{rtsp_url}` - Get the video stream
- `POST /api/stream/disconnect/{rtsp_url}` - Disconnect from the stream

## Development

- Backend API documentation is available at `http://localhost:8000/docs`
- The frontend is built with React and TypeScript for type safety
- The backend uses FastAPI for high-performance async operations
- Video streaming is handled using OpenCV and PyAV for efficient processing

## Security Considerations

- The current setup allows all CORS origins for development
- In production, configure CORS to allow only specific origins
- Consider implementing authentication for the API
- Secure RTSP credentials should be handled carefully
- Use HTTPS in production

## License

MIT
