from pydantic import BaseModel, Field
from typing import Literal

class CameraSettings(BaseModel):
    default_quality: Literal['high', 'medium', 'low']
    motion_sensitivity: int = Field(..., ge=1, le=100)

class StorageSettings(BaseModel):
    location: str
    retention_days: int = Field(..., ge=1)

class SystemSettings(BaseModel):
    autostart: bool
    log_level: Literal['debug', 'info', 'warning', 'error']

class NetworkSettings(BaseModel):
    ice_servers: str
    interface: str

class Settings(BaseModel):
    cameras: CameraSettings
    storage: StorageSettings
    system: SystemSettings
    network: NetworkSettings

    class Config:
        from_attributes = True 