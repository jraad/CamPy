from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

class Resolution(BaseModel):
    width: int = Field(..., ge=1, le=3840)  # Max 4K
    height: int = Field(..., ge=1, le=2160)

class CameraBase(BaseModel):
    name: str
    ip_address: str
    rtsp_url: str
    resolution: Resolution
    fps: int = Field(..., ge=1, le=60)
    codec: Literal['H.264', 'H.265']

class CameraCreate(CameraBase):
    pass

class CameraUpdate(CameraBase):
    pass

class Camera(CameraBase):
    id: str
    status: Literal['online', 'offline', 'error']
    last_seen: datetime | None = None

    class Config:
        from_attributes = True 