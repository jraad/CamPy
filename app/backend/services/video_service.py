import gi
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GLib
import threading
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class VideoService:
    def __init__(self):
        # Initialize GStreamer
        Gst.init(None)
        self.frame_count = 0
        self.frames_dir = '/app/frames'
        self.current_frame = None
        self.pipeline = None
        self.loop = None
        self.thread = None
        self.is_running = False
        
        # Ensure frames directory exists
        os.makedirs(self.frames_dir, exist_ok=True)
    
    def on_new_sample(self, sink):
        """Handle new video frames"""
        sample = sink.emit("pull-sample")
        if not sample:
            return Gst.FlowReturn.ERROR
        
        buffer = sample.get_buffer()
        if not buffer:
            return Gst.FlowReturn.ERROR
        
        # Extract and store the latest frame
        self.current_frame = buffer.extract_dup(0, buffer.get_size())
        
        # Save frame to disk (optional, for debugging)
        filename = os.path.join(self.frames_dir, f"frame_{self.frame_count}.jpg")
        with open(filename, 'wb') as f:
            f.write(self.current_frame)
        
        self.frame_count += 1
        return Gst.FlowReturn.OK
    
    def on_bus_message(self, bus, message):
        """Handle GStreamer bus messages"""
        t = message.type
        if t == Gst.MessageType.EOS:
            logger.info("End of stream")
            self.stop()
        elif t == Gst.MessageType.ERROR:
            err, debug = message.parse_error()
            logger.error(f"GStreamer error: {err}, {debug}")
            self.stop()
        return True

    def create_test_pipeline(self):
        """Create a test video pipeline"""
        # Source pipeline (test pattern)
        source_str = (
            'videotestsrc pattern=ball ! '
            'clockoverlay ! '
            'videoconvert ! '
            'x264enc tune=zerolatency bitrate=500 speed-preset=superfast ! '
            'video/x-h264,profile=baseline ! '
            'rtph264pay ! '
            'udpsink host=127.0.0.1 port=5000'
        )
        
        # Receiver pipeline
        receiver_str = (
            'udpsrc port=5000 caps="application/x-rtp,media=video,clock-rate=90000,encoding-name=H264" ! '
            'rtph264depay ! h264parse ! '
            'decodebin ! videoconvert ! '
            'videoscale ! video/x-raw,width=640,height=480 ! '
            'jpegenc quality=85 ! '
            'appsink name=sink emit-signals=true sync=false'
        )
        
        return source_str, receiver_str
    
    def create_rtsp_pipeline(self, rtsp_url: str):
        """Create a pipeline for RTSP streaming"""
        # We don't need a source pipeline for RTSP
        source_str = None
        
        # Receiver pipeline for RTSP
        receiver_str = (
            f'rtspsrc location={rtsp_url} latency=0 ! '
            'rtph264depay ! h264parse ! '
            'decodebin ! videoconvert ! '
            'videoscale ! video/x-raw,width=640,height=480 ! '
            'jpegenc quality=85 ! '
            'appsink name=sink emit-signals=true sync=false'
        )
        
        return source_str, receiver_str

    def start(self, rtsp_url: Optional[str] = None):
        """Start the video pipeline"""
        if self.is_running:
            return
        
        # Create appropriate pipeline based on input
        if rtsp_url:
            source_str, receiver_str = self.create_rtsp_pipeline(rtsp_url)
        else:
            source_str, receiver_str = self.create_test_pipeline()
        
        # Create and start source pipeline if needed
        if source_str:
            self.source_pipeline = Gst.parse_launch(source_str)
            self.source_pipeline.set_state(Gst.State.PLAYING)
        
        # Create and configure receiver pipeline
        self.pipeline = Gst.parse_launch(receiver_str)
        sink = self.pipeline.get_by_name('sink')
        sink.connect('new-sample', self.on_new_sample)
        
        # Add message handler
        bus = self.pipeline.get_bus()
        bus.add_signal_watch()
        bus.connect('message', self.on_bus_message)
        
        # Create GLib main loop in a separate thread
        self.loop = GLib.MainLoop()
        self.thread = threading.Thread(target=self.loop.run)
        self.thread.daemon = True
        self.thread.start()
        
        # Start the pipeline
        self.pipeline.set_state(Gst.State.PLAYING)
        self.is_running = True
        logger.info("Video pipeline started")
    
    def stop(self):
        """Stop the video pipeline"""
        if not self.is_running:
            return
        
        # Stop the pipelines
        if hasattr(self, 'source_pipeline'):
            self.source_pipeline.set_state(Gst.State.NULL)
        if self.pipeline:
            self.pipeline.set_state(Gst.State.NULL)
        
        # Stop the GLib main loop
        if self.loop:
            self.loop.quit()
        if self.thread:
            self.thread.join()
        
        self.is_running = False
        logger.info("Video pipeline stopped")
    
    def get_latest_frame(self) -> Optional[bytes]:
        """Get the latest frame as JPEG bytes"""
        return self.current_frame
    
    def __del__(self):
        """Cleanup when the service is destroyed"""
        self.stop() 