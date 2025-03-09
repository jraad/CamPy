from typing import List, Optional
from datetime import datetime
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.camera import Camera as CameraModel
from ..schemas.camera import Camera, CameraCreate, CameraUpdate

class CameraService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_cameras(self) -> List[Camera]:
        result = await self.db.execute(select(CameraModel))
        cameras = result.scalars().all()
        return [Camera.model_validate(camera) for camera in cameras]

    async def get_camera(self, camera_id: str) -> Optional[Camera]:
        result = await self.db.execute(
            select(CameraModel).filter(CameraModel.id == camera_id)
        )
        camera = result.scalar_one_or_none()
        return Camera.model_validate(camera) if camera else None

    async def create_camera(self, camera: CameraCreate) -> Camera:
        camera_id = str(uuid.uuid4())
        db_camera = CameraModel(
            id=camera_id,
            status='offline',
            last_seen=None,
            **camera.model_dump()
        )
        self.db.add(db_camera)
        await self.db.commit()
        await self.db.refresh(db_camera)
        return Camera.model_validate(db_camera)

    async def update_camera(self, camera_id: str, camera: CameraUpdate) -> Optional[Camera]:
        result = await self.db.execute(
            select(CameraModel).filter(CameraModel.id == camera_id)
        )
        db_camera = result.scalar_one_or_none()
        if not db_camera:
            return None

        for key, value in camera.model_dump().items():
            setattr(db_camera, key, value)

        await self.db.commit()
        await self.db.refresh(db_camera)
        return Camera.model_validate(db_camera)

    async def delete_camera(self, camera_id: str) -> bool:
        result = await self.db.execute(
            select(CameraModel).filter(CameraModel.id == camera_id)
        )
        db_camera = result.scalar_one_or_none()
        if not db_camera:
            return False

        await self.db.delete(db_camera)
        await self.db.commit()
        return True

    async def update_camera_status(self, camera_id: str, status: str) -> Optional[Camera]:
        result = await self.db.execute(
            select(CameraModel).filter(CameraModel.id == camera_id)
        )
        db_camera = result.scalar_one_or_none()
        if not db_camera:
            return None

        db_camera.status = status
        if status == 'online':
            db_camera.last_seen = datetime.now()

        await self.db.commit()
        await self.db.refresh(db_camera)
        return Camera.model_validate(db_camera) 