import React, { useState } from 'react';
import CameraStream from './CameraStream';
import CameraSettings from './CameraSettings';

interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  location: string;
  status: string;
  username?: string;
  password?: string;
}

interface CameraCardProps {
  camera: Camera;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: Partial<Camera>) => Promise<void>;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onDelete, onUpdate }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await onDelete(camera.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete camera');
    }
  };

  const handleUpdate = async (data: Partial<Camera>) => {
    try {
      await onUpdate(camera.id, data);
      setShowSettings(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update camera');
    }
  };

  return (
    <>
      <div className={`bg-gray-800 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <div className="relative">
          <CameraStream
            cameraId={camera.id}
            rtspUrl={camera.rtsp_url}
          />
          
          {/* Stream Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-gray-900 bg-opacity-75 text-white p-2 rounded-lg hover:bg-opacity-100 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-9h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 9h-4m4 0v-4m0 4l-5-5" />
                </svg>
              )}
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gray-900 bg-opacity-75 text-white p-2 rounded-lg hover:bg-opacity-100 transition-all"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{camera.name}</h2>
              <p className="text-gray-400">{camera.location}</p>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm text-gray-400">
                {camera.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-2 text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <CameraSettings
          camera={camera}
          onClose={() => setShowSettings(false)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CameraCard; 