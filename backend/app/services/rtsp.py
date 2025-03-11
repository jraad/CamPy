import cv2
import numpy as np
from typing import Generator, Optional
import av

class RTSPService:
    def __init__(self):
        self._streams = {}

    async def connect_to_stream(self, rtsp_url: str) -> bool:
        """
        Connect to an RTSP stream and store the connection
        """
        try:
            container = av.open(rtsp_url, mode='r')
            self._streams[rtsp_url] = container
            return True
        except Exception as e:
            print(f"Error connecting to stream: {e}")
            return False

    async def get_stream_frame(self, rtsp_url: str) -> Optional[bytes]:
        """
        Get a single frame from the stream as JPEG bytes
        """
        try:
            container = self._streams.get(rtsp_url)
            if not container:
                return None

            stream = container.streams.video[0]
            for frame in container.decode(stream):
                # Convert frame to JPEG bytes
                img = frame.to_ndarray(format='bgr24')
                _, buffer = cv2.imencode('.jpg', img)
                return buffer.tobytes()

        except Exception as e:
            print(f"Error getting frame: {e}")
            return None

    async def stream_generator(self, rtsp_url: str) -> Generator[bytes, None, None]:
        """
        Generate frames for streaming
        """
        while True:
            frame = await self.get_stream_frame(rtsp_url)
            if frame is not None:
                yield (b'--frame\r\n'
                      b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    def disconnect(self, rtsp_url: str) -> None:
        """
        Disconnect from the RTSP stream
        """
        if rtsp_url in self._streams:
            self._streams[rtsp_url].close()
            del self._streams[rtsp_url] 