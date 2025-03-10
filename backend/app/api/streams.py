from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict

from ..core.database import get_db
from ..services.camera_service import CameraService
from ..services.stream_service import StreamService
from ..schemas.stream import StreamOffer, StreamAnswer, StreamStatus

router = APIRouter()
stream_service = StreamService()

async def get_camera_service(db: AsyncSession = Depends(get_db)) -> CameraService:
    return CameraService(db)

@router.post("/streams/{camera_id}/offer", response_model=StreamAnswer)
async def create_stream(
    camera_id: str,
    offer: StreamOffer,
    camera_service: CameraService = Depends(get_camera_service)
):
    """Create a WebRTC stream for a camera."""
    # Get camera details
    camera = await camera_service.get_camera(camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")

    # Create WebRTC connection
    try:
        answer = await stream_service.create_stream(
            camera_id=camera_id,
            rtsp_url=camera.rtsp_url,
            offer=offer.sdp
        )
        return StreamAnswer(sdp=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/streams/{camera_id}")
async def stop_stream(camera_id: str):
    """Stop streaming for a camera."""
    try:
        await stream_service.stop_stream(camera_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/streams/{camera_id}/status", response_model=StreamStatus)
def get_stream_status(camera_id: str):
    """Get the status of a camera stream."""
    status = stream_service.get_stream_status(camera_id)
    if status is None:
        raise HTTPException(status_code=404, detail="Stream not found")
    return StreamStatus(status=status) 