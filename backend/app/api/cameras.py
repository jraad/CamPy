from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
import cv2
import asyncio
from pydantic import BaseModel

from ..schemas.camera import Camera, CameraCreate, CameraUpdate
from ..services.camera_service import CameraService
from ..core.database import get_db

router = APIRouter()

class TestConnectionRequest(BaseModel):
    rtsp_url: str
    username: str | None = None
    password: str | None = None

async def get_camera_service(db: AsyncSession = Depends(get_db)) -> CameraService:
    return CameraService(db)

@router.get("/cameras", response_model=List[Camera])
async def get_cameras(camera_service: CameraService = Depends(get_camera_service)):
    return await camera_service.get_cameras()

@router.get("/cameras/{camera_id}", response_model=Camera)
async def get_camera(camera_id: str, camera_service: CameraService = Depends(get_camera_service)):
    camera = await camera_service.get_camera(camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.post("/cameras", response_model=Camera)
async def create_camera(camera: CameraCreate, camera_service: CameraService = Depends(get_camera_service)):
    return await camera_service.create_camera(camera)

@router.put("/cameras/{camera_id}", response_model=Camera)
async def update_camera(camera_id: str, camera: CameraUpdate, camera_service: CameraService = Depends(get_camera_service)):
    updated_camera = await camera_service.update_camera(camera_id, camera)
    if not updated_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return updated_camera

@router.delete("/cameras/{camera_id}")
async def delete_camera(camera_id: str, camera_service: CameraService = Depends(get_camera_service)):
    success = await camera_service.delete_camera(camera_id)
    if not success:
        raise HTTPException(status_code=404, detail="Camera not found")
    return {"status": "success"}

@router.post("/cameras/test-connection")
async def test_connection(request: TestConnectionRequest):
    """Test RTSP stream connection."""
    try:
        # Build RTSP URL with credentials if provided
        url = request.rtsp_url
        if request.username and request.password:
            # Insert credentials into URL
            protocol, rest = url.split("://", 1)
            url = f"{protocol}://{request.username}:{request.password}@{rest}"

        # Try to open the stream
        cap = cv2.VideoCapture(url)
        
        # Try to read a frame with a timeout
        success = False
        try:
            # Run frame capture in a separate thread with timeout
            loop = asyncio.get_event_loop()
            success = await loop.run_in_executor(None, cap.read)[0]
        finally:
            cap.release()

        if not success:
            raise HTTPException(
                status_code=400,
                detail="Could not connect to camera stream"
            )

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to connect to camera: {str(e)}"
        ) 