from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.sql import func
from ..core.database import Base

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)
    rtsp_url = Column(String, nullable=False)
    resolution = Column(JSON, nullable=False)  # Stores Resolution as JSON
    fps = Column(Integer, nullable=False)
    codec = Column(String, nullable=False)
    status = Column(String, nullable=False, default='offline')
    last_seen = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 