from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CamPy NVR"
    
    # RTSP Configuration
    DEFAULT_RTSP_PORT: int = 554
    STREAM_BUFFER_SIZE: int = 1024 * 1024  # 1MB buffer
    
    # WebSocket Configuration
    WS_HEARTBEAT_INTERVAL: int = 30  # seconds
    
    # Database Configuration
    DATABASE_URL: Optional[str] = "sqlite:///./campy.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings() 