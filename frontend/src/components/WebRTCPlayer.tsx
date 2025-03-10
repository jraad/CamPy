'use client';

import { useEffect, useRef } from 'react';
import 'webrtc-adapter';

interface WebRTCPlayerProps {
  streamUrl: string;
  onError?: (error: Error) => void;
}

export default function WebRTCPlayer({ streamUrl, onError }: WebRTCPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startStream() {
      try {
        // Create a new RTCPeerConnection
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = peerConnection;

        // Add event handlers
        peerConnection.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.oniceconnectionstatechange = () => {
          console.log('ICE Connection State:', peerConnection.iceConnectionState);
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate === null) {
            // ICE gathering completed, send the offer
            sendOffer(peerConnection.localDescription);
          }
        };

        // Create and send offer
        const offer = await peerConnection.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        });
        await peerConnection.setLocalDescription(offer);

      } catch (error) {
        console.error('Error starting stream:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    }

    async function sendOffer(offer: RTCSessionDescription | null) {
      if (!offer) return;

      try {
        // Convert streamUrl from webrtc:// to http:// format
        const apiUrl = streamUrl.replace('webrtc://', 'http://');
        
        // Send the offer to MediaMTX
        const response = await fetch(`${apiUrl}/whep`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        });

        if (!response.ok) {
          throw new Error(`Failed to send offer: ${response.statusText}`);
        }

        // Get the SDP answer from MediaMTX
        const answerSdp = await response.text();
        
        if (!peerConnectionRef.current) {
          throw new Error('PeerConnection not initialized');
        }

        // Set the remote description
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription({
            type: 'answer',
            sdp: answerSdp,
          })
        );

      } catch (error) {
        console.error('Error in signaling:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    }

    startStream();

    return () => {
      mounted = false;
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [streamUrl, onError]);

  return (
    <div className="relative w-full aspect-video bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
} 