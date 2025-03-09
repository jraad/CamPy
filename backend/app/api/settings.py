from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.settings import Settings, CameraSettings, StorageSettings, SystemSettings, NetworkSettings
from ..services.settings_service import SettingsService
from ..core.database import get_db

router = APIRouter()

async def get_settings_service(db: AsyncSession = Depends(get_db)) -> SettingsService:
    return SettingsService(db)

@router.get("/settings", response_model=Settings)
async def get_settings(settings_service: SettingsService = Depends(get_settings_service)):
    return await settings_service.get_settings()

@router.put("/settings", response_model=Settings)
async def update_settings(settings: Settings, settings_service: SettingsService = Depends(get_settings_service)):
    return await settings_service.update_settings(settings)

@router.get("/settings/cameras", response_model=CameraSettings)
async def get_camera_settings(settings_service: SettingsService = Depends(get_settings_service)):
    return await settings_service.get_camera_settings()

@router.get("/settings/storage", response_model=StorageSettings)
async def get_storage_settings(settings_service: SettingsService = Depends(get_settings_service)):
    return await settings_service.get_storage_settings()

@router.get("/settings/system", response_model=SystemSettings)
async def get_system_settings(settings_service: SettingsService = Depends(get_settings_service)):
    return await settings_service.get_system_settings()

@router.get("/settings/network", response_model=NetworkSettings)
async def get_network_settings(settings_service: SettingsService = Depends(get_settings_service)):
    return await settings_service.get_network_settings() 