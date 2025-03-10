import React, { useEffect, useRef, useState } from 'react';

interface CameraStreamProps {
  cameraId: string;
  rtspUrl: string;
}

const CameraStream: React.FC<CameraStreamProps> = ({ cameraId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const startStream = async () => {
      try {
        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = pc;

        // Add video track handler
        pc.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        // Connection state changes
        pc.onconnectionstatechange = () => {
          if (mounted) {
            setStatus(pc.connectionState);
          }
        };

        // Create offer
        const offer = await pc.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: false
        });
        await pc.setLocalDescription(offer);

        // Send offer to server
        const response = await fetch(`/api/v1/streams/${cameraId}/offer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sdp: offer
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create stream');
        }

        // Get answer from server
        const { sdp: answer } = await response.json();
        await pc.setRemoteDescription(answer);

      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to start stream');
          setStatus('failed');
        }
      }
    };

    startStream();

    return () => {
      mounted = false;
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [cameraId]);

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />
      
      {/* Status overlay */}
      {status !== 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p>{status === 'connecting' ? 'Connecting...' : status}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraStream; 