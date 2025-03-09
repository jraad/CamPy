'use client';

import { Camera } from '@/lib/types/camera';

interface CameraCardProps {
  camera: Camera;
}

export default function CameraCard({ camera }: CameraCardProps) {
  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    error: 'bg-red-500',
  }[camera.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Camera Preview */}
      <div className="aspect-video bg-gray-900 relative">
        {/* This will be replaced with actual video stream */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
          Camera Preview
        </div>
      </div>

      {/* Camera Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{camera.name}</h3>
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Resolution: {camera.resolution.width}x{camera.resolution.height}</p>
          <p>FPS: {camera.fps}</p>
          <p>Codec: {camera.codec}</p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            View
          </button>
          <button className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
} 