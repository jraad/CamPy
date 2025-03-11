from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging

from ..services.video_service import VideoService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CamPy NVR",
    description="A Python-based Network Video Recorder system",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a global video service instance
video_service = VideoService()

@app.get("/")
async def root():
    return {"status": "online", "message": "CamPy NVR API is running"}

@app.post("/stream/start")
async def start_stream(rtsp_url: Optional[str] = None):
    """Start the video stream"""
    try:
        video_service.start(rtsp_url)
        return {"status": "success", "message": "Stream started"}
    except Exception as e:
        logger.error(f"Failed to start stream: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stream/stop")
async def stop_stream():
    """Stop the video stream"""
    try:
        video_service.stop()
        return {"status": "success", "message": "Stream stopped"}
    except Exception as e:
        logger.error(f"Failed to stop stream: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stream/status")
async def get_stream_status():
    """Get the current stream status"""
    return {
        "is_running": video_service.is_running,
        "frame_count": video_service.frame_count
    }

@app.get("/frame/latest")
async def get_latest_frame():
    """Get the latest frame as JPEG image"""
    if not video_service.is_running:
        raise HTTPException(status_code=400, detail="Stream is not running")
    
    frame = video_service.get_latest_frame()
    if frame is None:
        raise HTTPException(status_code=404, detail="No frame available")
    
    return Response(content=frame, media_type="image/jpeg") 