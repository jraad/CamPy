from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..services.rtsp import RTSPService
from typing import Optional

router = APIRouter()
rtsp_service = RTSPService()

@router.post("/connect")
async def connect_stream(rtsp_url: str):
    """
    Connect to an RTSP stream
    """
    success = await rtsp_service.connect_to_stream(rtsp_url)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to connect to stream")
    return {"status": "connected", "url": rtsp_url}

@router.get("/stream/{rtsp_url:path}")
async def stream_video(rtsp_url: str):
    """
    Stream video from RTSP source
    """
    return StreamingResponse(
        rtsp_service.stream_generator(rtsp_url),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.post("/disconnect/{rtsp_url:path}")
async def disconnect_stream(rtsp_url: str):
    """
    Disconnect from an RTSP stream
    """
    rtsp_service.disconnect(rtsp_url)
    return {"status": "disconnected", "url": rtsp_url} 