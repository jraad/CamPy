import gi
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GLib
import sys

def on_bus_message(bus, message, loop):
    t = message.type
    if t == Gst.MessageType.EOS:
        print("End of stream")
        loop.quit()
    elif t == Gst.MessageType.ERROR:
        err, debug = message.parse_error()
        print(f"Error: {err}, {debug}")
        loop.quit()
    return True

def main():
    # Initialize GStreamer
    Gst.init(None)
    
    # Create a pipeline
    pipeline = Gst.Pipeline.new('test-pipeline')
    
    # Create elements
    source = Gst.ElementFactory.make('videotestsrc', 'source')
    sink = Gst.ElementFactory.make('autovideosink', 'sink')
    
    # Add elements to pipeline
    pipeline.add(source)
    pipeline.add(sink)
    
    # Link elements
    source.link(sink)
    
    # Start playing
    ret = pipeline.set_state(Gst.State.PLAYING)
    if ret == Gst.StateChangeReturn.FAILURE:
        print("Unable to set the pipeline to the playing state")
        sys.exit(1)
    
    # Get the bus and add watch
    bus = pipeline.get_bus()
    bus.add_signal_watch()
    bus.connect('message', on_bus_message, GLib.MainLoop())
    
    # Create a GLib MainLoop and run
    loop = GLib.MainLoop()
    try:
        loop.run()
    except KeyboardInterrupt:
        pass
    finally:
        pipeline.set_state(Gst.State.NULL)
        loop.quit()

if __name__ == '__main__':
    main() 