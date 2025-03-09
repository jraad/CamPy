'use client';

import { useState } from 'react';
import CameraGrid from '@/components/cameras/CameraGrid';
import AddCameraModal from '@/components/cameras/AddCameraModal';
import { Camera } from '@/lib/types/camera';

// Temporary mock data
const mockCameras: Camera[] = [
  {
    id: '1',
    name: 'Front Door',
    ip_address: '192.168.1.100',
    rtsp_url: 'rtsp://192.168.1.100:554/stream1',
    status: 'online',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    codec: 'H.264',
  },
  {
    id: '2',
    name: 'Back Yard',
    ip_address: '192.168.1.101',
    rtsp_url: 'rtsp://192.168.1.101:554/stream1',
    status: 'offline',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    codec: 'H.265',
  },
];

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCamera = (newCamera: Omit<Camera, 'id' | 'status'>) => {
    const camera: Camera = {
      ...newCamera,
      id: String(Date.now()), // Temporary ID generation
      status: 'offline', // Initial status
    };
    setCameras(prev => [...prev, camera]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cameras</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Camera
        </button>
      </div>

      <CameraGrid cameras={cameras} />
      
      <AddCameraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCamera}
      />
    </div>
  );
} 