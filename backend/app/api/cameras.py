from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.camera import Camera, CameraCreate, CameraUpdate
from ..services.camera_service import CameraService
from ..core.database import get_db

router = APIRouter()

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