import React, { useState } from 'react';

interface VideoStreamProps {
  apiBaseUrl: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ apiBaseUrl }) => {
  const [rtspUrl, setRtspUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [streamUrl, setStreamUrl] = useState<string>('');

  const connectToStream = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rtsp_url: rtspUrl }),
      });

      if (response.ok) {
        setIsConnected(true);
        // Encode the RTSP URL for use in the stream endpoint
        const encodedUrl = encodeURIComponent(rtspUrl);
        setStreamUrl(`${apiBaseUrl}/stream/${encodedUrl}`);
      } else {
        console.error('Failed to connect to stream');
      }
    } catch (error) {
      console.error('Error connecting to stream:', error);
    }
  };

  const disconnectFromStream = async () => {
    if (!rtspUrl) return;

    try {
      const encodedUrl = encodeURIComponent(rtspUrl);
      const response = await fetch(`${apiBaseUrl}/disconnect/${encodedUrl}`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsConnected(false);
        setStreamUrl('');
      }
    } catch (error) {
      console.error('Error disconnecting from stream:', error);
    }
  };

  return (
    <div className="video-stream">
      <div className="controls">
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="Enter RTSP URL"
          style={{ width: '300px', padding: '8px', marginRight: '10px' }}
        />
        <button
          onClick={isConnected ? disconnectFromStream : connectToStream}
          style={{
            padding: '8px 16px',
            backgroundColor: isConnected ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      
      {isConnected && streamUrl && (
        <div className="stream-container" style={{ marginTop: '20px' }}>
          <img
            src={streamUrl}
            alt="RTSP Stream"
            style={{
              maxWidth: '100%',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoStream; 