'use client';

import { useEffect, useState } from 'react';
import CameraCard from '../../components/CameraCard';
import AddCamera from '../../components/AddCamera';

interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  location: string;
  status: string;
  username?: string;
  password?: string;
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCamera, setShowAddCamera] = useState(false);

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/v1/cameras');
      if (!response.ok) {
        throw new Error('Failed to fetch cameras');
      }
      const data = await response.json();
      setCameras(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cameras');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCamera = async (data: Omit<Camera, 'id' | 'status'>) => {
    try {
      const response = await fetch('/api/v1/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add camera');
      }

      await fetchCameras();
      setShowAddCamera(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateCamera = async (id: string, data: Partial<Camera>) => {
    try {
      const response = await fetch(`/api/v1/cameras/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update camera');
      }

      await fetchCameras();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteCamera = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/cameras/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete camera');
      }

      await fetchCameras();
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cameras</h1>
        <button
          onClick={() => setShowAddCamera(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Camera
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onDelete={handleDeleteCamera}
            onUpdate={handleUpdateCamera}
          />
        ))}
      </div>

      {cameras.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No cameras found</p>
          <button
            onClick={() => setShowAddCamera(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Camera
          </button>
        </div>
      )}

      {showAddCamera && (
        <AddCamera
          onClose={() => setShowAddCamera(false)}
          onAdd={handleAddCamera}
        />
      )}
    </div>
  );
} 