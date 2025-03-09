from sqlalchemy import Column, String, Integer, Boolean, JSON
from sqlalchemy.sql import func
from ..core.database import Base

class Settings(Base):
    __tablename__ = "settings"

    id = Column(String, primary_key=True, default="global")  # Single row for global settings
    cameras = Column(JSON, nullable=False)  # CameraSettings as JSON
    storage = Column(JSON, nullable=False)  # StorageSettings as JSON
    system = Column(JSON, nullable=False)   # SystemSettings as JSON
    network = Column(JSON, nullable=False)  # NetworkSettings as JSON
    created_at = Column(String, server_default=func.now())
    updated_at = Column(String, onupdate=func.now()) 