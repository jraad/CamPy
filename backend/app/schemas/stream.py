from pydantic import BaseModel
from typing import Optional

class StreamOffer(BaseModel):
    """WebRTC offer from client."""
    sdp: dict

class StreamAnswer(BaseModel):
    """WebRTC answer from server."""
    sdp: dict

class StreamStatus(BaseModel):
    """Stream status."""
    status: str  # new, connecting, connected, disconnected, failed 