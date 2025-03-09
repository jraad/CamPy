# Camera-Based Security System Development Plan

## Project Status

### Completed Features
1. **Infrastructure Setup**
   - Docker-based development environment with:
     - PostgreSQL database (port 5432)
     - Redis cache (port 6379)
     - FastAPI backend (port 8000)
   - Next.js frontend (port 3000)
   - Database migrations using Alembic

2. **Backend Implementation**
   - FastAPI application structure
   - Database models and schemas:
     - Camera management (CRUD operations)
     - System settings management
   - Async database operations with SQLAlchemy
   - API endpoints for:
     - `/api/v1/cameras` - Camera management
     - `/api/v1/settings` - System settings

3. **Frontend Implementation**
   - Next.js project setup
   - Basic routing structure
   - Initial UI components

### In Progress
1. **Camera Integration**
   - RTSP stream handling
   - WebRTC implementation
   - Motion detection setup

### Pending Features
1. **Object Detection**
2. **Video Storage**
3. **Analytics**
4. **Mobile App**

## Core Requirements

### Backend Requirements

- Support multiple RTSP POE cameras with efficient streaming
- Implement motion detection with minimal performance impact
- Object detection (people, animals, vehicles, etc.)
- Identify recurring objects (e.g., same person appearing multiple times)
- Efficient storage and retrieval of recorded footage
- Provide an API for frontend communication (RESTful/FastAPI)
- Scalable and optimized for real-time performance

### Frontend Requirements

- Web UI to view live streams from cameras
- Display motion detection events and categorized objects
- Allow searching and filtering recorded footage
- User-friendly and aesthetically pleasing interface
- Mobile app (eventually) to provide alerts and remote access

## Technology Stack

### Backend

- **Language:** Python
- **Streaming Handling:** OpenCV, GStreamer, FFmpeg
- **Motion Detection:** OpenCV frame differencing, background subtraction
- **Object Detection:** YOLOv8 (Ultralytics) or MobileNet-SSD
- **Web API:** FastAPI (async, high-performance)
- **Database:** PostgreSQL + TimescaleDB (optimized for time-series data)
- **Storage:** Local filesystem or cloud (AWS S3, MinIO)
- **Message Queue:** Redis/Kafka for event handling

### Frontend

- **Web UI:** React (Next.js) + TailwindCSS
- **Live Stream Handling:** WebRTC, HLS (MSE-compatible browsers)
- **Mobile App (Future):** Swift (iOS) or React Native

## Development Phases

### Phase 1: Base Streaming & Viewing _(In Progress)_
- [x] Set up FastAPI-based backend
- [x] Set up database and migrations
- [x] Create basic React dashboard
- [ ] Integrate OpenCV/GStreamer for RTSP streams
- [ ] Implement live stream viewing functionality
- [ ] Display multiple camera feeds in a grid

### Phase 2: Motion Detection & Alerts
- [ ] Implement motion detection using OpenCV
- [ ] Store motion events in the database
- [ ] Provide an API to fetch motion events
- [ ] Display motion event alerts in real-time
- [ ] Highlight detected motion on the video feed
- [ ] Create a simple event history list

### Phase 3: Object Detection & Categorization
- [ ] Integrate YOLOv8 or MobileNet-SSD
- [ ] Store detected objects with metadata
- [ ] Provide API for categorized object retrieval
- [ ] Display detected objects in the UI
- [ ] Implement filtering by object type
- [ ] Allow viewing clips based on detected objects

### Phase 4: Object Tracking & Re-Identification
- [ ] Implement tracking for recurring objects
- [ ] Store unique objects and create categories
- [ ] Provide API for categorized appearances
- [ ] Display recurring objects in UI
- [ ] Enable manual object labeling
- [ ] Search and filter tracked objects

### Phase 5: Web UI Enhancements & Analytics
- [ ] Store analytics data
- [ ] Optimize storage and retrieval
- [ ] Add data visualization
- [ ] Implement advanced search
- [ ] Improve UI aesthetics

### Phase 6: Mobile App Development
- [ ] Implement push notifications
- [ ] Optimize API for mobile
- [ ] Develop mobile app
- [ ] Enable clip playback
- [ ] Add mobile alerts

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for local development)

### Development Setup
1. Clone the repository
2. Start the backend services:
   ```bash
   docker compose up -d
   ```
3. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Database Management
- Migrations are handled with Alembic
- To create a new migration:
  ```bash
  docker compose exec backend alembic revision --autogenerate -m "Description"
  ```
- To apply migrations:
  ```bash
  docker compose exec backend alembic upgrade head
  ```

## Next Steps
1. Implement RTSP stream handling
2. Set up WebRTC for real-time streaming
3. Create camera feed grid view
4. Implement motion detection

---

This plan ensures backend and frontend development proceed in parallel, allowing for continuous testing and usability improvements. Let me know if you'd like to adjust any priorities!

