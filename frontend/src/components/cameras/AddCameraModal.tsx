'use client';

import { useState } from 'react';
import { Camera } from '@/lib/types/camera';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (camera: Omit<Camera, 'id' | 'status'>) => void;
}

type CameraFormData = {
  name: string;
  ip_address: string;
  rtsp_url: string;
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  codec: 'H.264' | 'H.265';
};

export default function AddCameraModal({ isOpen, onClose, onAdd }: AddCameraModalProps) {
  const [formData, setFormData] = useState<CameraFormData>({
    name: '',
    ip_address: '',
    rtsp_url: '',
    resolution: {
      width: 1920,
      height: 1080
    },
    fps: 30,
    codec: 'H.264'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Camera</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Camera Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              placeholder="Front Door Camera"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              IP Address
            </label>
            <input
              type="text"
              required
              value={formData.ip_address}
              onChange={(e) => setFormData(prev => ({ ...prev, ip_address: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              placeholder="192.168.1.100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              RTSP URL
            </label>
            <input
              type="text"
              required
              value={formData.rtsp_url}
              onChange={(e) => setFormData(prev => ({ ...prev, rtsp_url: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              placeholder="rtsp://192.168.1.100:554/stream1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolution
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={formData.resolution.width}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resolution: { ...prev.resolution, width: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  placeholder="Width"
                />
                <span className="text-gray-700 dark:text-gray-300 flex items-center">x</span>
                <input
                  type="number"
                  required
                  value={formData.resolution.height}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resolution: { ...prev.resolution, height: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  placeholder="Height"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                FPS
              </label>
              <input
                type="number"
                required
                min="1"
                max="60"
                value={formData.fps}
                onChange={(e) => setFormData(prev => ({ ...prev, fps: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Codec
            </label>
            <select
              value={formData.codec}
              onChange={(e) => setFormData(prev => ({ ...prev, codec: e.target.value as 'H.264' | 'H.265' }))}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="H.264">H.264</option>
              <option value="H.265">H.265</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Camera
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 