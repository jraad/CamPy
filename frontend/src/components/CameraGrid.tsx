'use client';

import { useState } from 'react';
import WebRTCViewer from './WebRTCViewer';

interface Camera {
  id: string;
  name: string;
  streamUrl: string;
}

interface CameraGridProps {
  cameras: Camera[];
}

export default function CameraGrid({ cameras }: CameraGridProps) {
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const handleStreamError = (cameraId: string, error: Error) => {
    setErrorMessages(prev => ({
      ...prev,
      [cameraId]: error.message
    }));
  };

  // Calculate grid columns based on number of cameras
  const gridCols = cameras.length <= 4 ? 2 : 3;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${gridCols} gap-4 p-4`}>
      {cameras.map(camera => (
        <div key={camera.id} className="aspect-video relative">
          <div className="absolute top-0 left-0 z-10 p-2 bg-black/50 text-white rounded-tl-lg">
            {camera.name}
          </div>
          
          <WebRTCViewer
            streamUrl={camera.streamUrl}
            onError={(error) => handleStreamError(camera.id, error)}
          />
          
          {errorMessages[camera.id] && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white text-center p-4">
              <p>Error: {errorMessages[camera.id]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 