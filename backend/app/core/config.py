from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CamPy"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    
    # Database Settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "campy"
    SQLALCHEMY_DATABASE_URI: str = ""
    
    # Redis Settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Security Settings
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Storage Settings
    STORAGE_PATH: str = "./storage"  # Default local storage path
    
    # Camera Settings
    MAX_CAMERAS: int = 8
    DEFAULT_STREAM_FPS: int = 30
    DEFAULT_STREAM_QUALITY: int = 720  # 720p
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 