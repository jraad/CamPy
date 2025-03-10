'use client';

import { useEffect, useRef, useState } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface WebRTCViewerProps {
  streamUrl: string;
  onError?: (error: Error) => void;
}

export default function WebRTCViewer({ streamUrl, onError }: WebRTCViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<string>('disconnected');

  const connectToStream = async () => {
    try {
      console.log('Connecting to stream...');
      
      // Create a new RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Set up event handlers
      pc.ontrack = (event) => {
        console.log('Received track:', event.track.kind);
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        setConnectionState(pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'failed') {
          console.error('Connection failed, attempting reconnect...');
          disconnectFromStream();
          setTimeout(connectToStream, 2000);
        }
      };

      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === 'complete') {
          resolve();
        } else {
          pc.onicegatheringstatechange = () => {
            if (pc.iceGatheringState === 'complete') {
              resolve();
            }
          };
        }
      });

      // Send the offer to MediaMTX using POST
      const response = await fetch(`http://${window.location.hostname}:8083/test/whep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'Authorization': 'Basic ' + btoa('admin:admin')
        },
        body: pc.localDescription?.sdp
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the SDP answer
      const answerSdp = await response.text();
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp
      });

      setPeerConnection(pc);
      setIsPlaying(true);
      setConnectionState('connected');
    } catch (error) {
      console.error('Error connecting to stream:', error);
      onError?.(error as Error);
      setConnectionState('failed');
    }
  };

  const disconnectFromStream = () => {
    console.log('Disconnecting from stream...');
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsPlaying(false);
    setConnectionState('disconnected');
  };

  const togglePlay = () => {
    if (isPlaying) {
      disconnectFromStream();
    } else {
      connectToStream();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    return () => {
      disconnectFromStream();
    };
  }, []);

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        autoPlay
        playsInline
        muted={isMuted}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-white" />
            ) : (
              <PlayIcon className="w-6 h-6 text-white" />
            )}
          </button>
          
          <div className="text-white text-sm">
            {connectionState}
          </div>
          
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <SpeakerWaveIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 