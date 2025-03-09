from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.settings import Settings as SettingsModel
from ..schemas.settings import Settings, CameraSettings, StorageSettings, SystemSettings, NetworkSettings

class SettingsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self._default_settings = {
            "cameras": CameraSettings(
                default_quality='high',
                motion_sensitivity=50
            ),
            "storage": StorageSettings(
                location='/opt/campy/storage',
                retention_days=30
            ),
            "system": SystemSettings(
                autostart=True,
                log_level='info'
            ),
            "network": NetworkSettings(
                ice_servers='stun:stun.l.google.com:19302',
                interface='auto'
            )
        }

    async def _get_or_create_settings(self) -> SettingsModel:
        result = await self.db.execute(
            select(SettingsModel).filter(SettingsModel.id == "global")
        )
        settings = result.scalar_one_or_none()
        
        if not settings:
            settings = SettingsModel(
                id="global",
                **{k: v.model_dump() for k, v in self._default_settings.items()}
            )
            self.db.add(settings)
            await self.db.commit()
            await self.db.refresh(settings)
        
        return settings

    async def get_settings(self) -> Settings:
        settings = await self._get_or_create_settings()
        return Settings(
            cameras=CameraSettings(**settings.cameras),
            storage=StorageSettings(**settings.storage),
            system=SystemSettings(**settings.system),
            network=NetworkSettings(**settings.network)
        )

    async def update_settings(self, settings: Settings) -> Settings:
        db_settings = await self._get_or_create_settings()
        
        # Update each settings section
        db_settings.cameras = settings.cameras.model_dump()
        db_settings.storage = settings.storage.model_dump()
        db_settings.system = settings.system.model_dump()
        db_settings.network = settings.network.model_dump()
        
        await self.db.commit()
        await self.db.refresh(db_settings)
        
        return await self.get_settings()

    async def get_camera_settings(self) -> CameraSettings:
        settings = await self.get_settings()
        return settings.cameras

    async def get_storage_settings(self) -> StorageSettings:
        settings = await self.get_settings()
        return settings.storage

    async def get_system_settings(self) -> SystemSettings:
        settings = await self.get_settings()
        return settings.system

    async def get_network_settings(self) -> NetworkSettings:
        settings = await self.get_settings()
        return settings.network 