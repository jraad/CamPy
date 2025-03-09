'use client';

import { Camera } from '@/lib/types/camera';
import CameraCard from './CameraCard';

interface CameraGridProps {
  cameras: Camera[];
}

export default function CameraGrid({ cameras }: CameraGridProps) {
  if (cameras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
        <p className="text-xl text-gray-600">No cameras configured</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Camera
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cameras.map((camera) => (
        <CameraCard key={camera.id} camera={camera} />
      ))}
    </div>
  );
} 