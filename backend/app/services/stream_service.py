import asyncio
import cv2
import logging
from typing import Dict, Optional
from aiortc import MediaStreamTrack, RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaBlackhole, MediaPlayer, MediaRecorder
from av import VideoFrame
import numpy as np

logger = logging.getLogger(__name__)

class VideoStreamTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, rtsp_url: str):
        super().__init__()
        self.rtsp_url = rtsp_url
        self.cap = cv2.VideoCapture(rtsp_url)
        self._start = None

    async def recv(self) -> VideoFrame:
        if self.readyState != "live":
            raise MediaStreamError

        ret, frame = self.cap.read()
        if not ret:
            # If frame reading fails, try to reconnect
            self.cap.release()
            self.cap = cv2.VideoCapture(self.rtsp_url)
            ret, frame = self.cap.read()
            if not ret:
                # If still fails, return a black frame
                frame = np.zeros((720, 1280, 3), np.uint8)

        # Convert BGR to RGB
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = VideoFrame.from_ndarray(frame, format="rgb24")
        pts, time_base = await self.next_timestamp()
        frame.pts = pts
        frame.time_base = time_base

        return frame

    def stop(self):
        super().stop()
        self.cap.release()

class StreamService:
    def __init__(self):
        self.peer_connections: Dict[str, RTCPeerConnection] = {}
        self.video_tracks: Dict[str, VideoStreamTrack] = {}

    async def create_stream(self, camera_id: str, rtsp_url: str, offer: RTCSessionDescription) -> RTCSessionDescription:
        """Create a WebRTC stream for a camera."""
        pc = RTCPeerConnection()
        self.peer_connections[camera_id] = pc

        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
            logger.info(f"Connection state for camera {camera_id} is {pc.connectionState}")
            if pc.connectionState == "failed":
                await self.stop_stream(camera_id)

        # Create video track
        video_track = VideoStreamTrack(rtsp_url)
        self.video_tracks[camera_id] = video_track
        pc.addTrack(video_track)

        # Set the remote description
        await pc.setRemoteDescription(offer)

        # Create answer
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        return pc.localDescription

    async def stop_stream(self, camera_id: str):
        """Stop streaming for a camera."""
        if camera_id in self.peer_connections:
            pc = self.peer_connections[camera_id]
            await pc.close()
            del self.peer_connections[camera_id]

        if camera_id in self.video_tracks:
            track = self.video_tracks[camera_id]
            track.stop()
            del self.video_tracks[camera_id]

    def get_stream_status(self, camera_id: str) -> Optional[str]:
        """Get the status of a camera stream."""
        if camera_id in self.peer_connections:
            return self.peer_connections[camera_id].connectionState
        return None 