import gi
gi.require_version('Gst', '1.0')
from gi import repository as repo
import logging

class RTSPHandler:
    def __init__(self, stream_url: str):
        self.stream_url = stream_url
        self.pipeline = None
        self.logger = logging.getLogger(__name__)
        
    def create_pipeline(self):
        """Create a GStreamer pipeline for RTSP streaming"""
        try:
            pipeline_str = (
                f'rtspsrc location={self.stream_url} latency=0 ! '
                'rtph264depay ! h264parse ! avdec_h264 ! videoconvert ! '
                'videoscale ! video/x-raw,width=640,height=480 ! jpegenc ! '
                'appsink name=sink emit-signals=True sync=False'
            )
            self.pipeline = repo.Gst.parse_launch(pipeline_str)
            return True
        except Exception as e:
            self.logger.error(f"Failed to create pipeline: {str(e)}")
            return False
    
    def start_stream(self):
        """Start the RTSP stream"""
        if not self.pipeline:
            if not self.create_pipeline():
                return False
        
        ret = self.pipeline.set_state(repo.Gst.State.PLAYING)
        if ret == repo.Gst.StateChangeReturn.FAILURE:
            self.logger.error("Failed to start pipeline")
            return False
        return True
    
    def stop_stream(self):
        """Stop the RTSP stream"""
        if self.pipeline:
            self.pipeline.set_state(repo.Gst.State.NULL)
            self.pipeline = None 