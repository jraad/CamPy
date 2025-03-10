import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  location: string;
  status: string;
  username?: string;
  password?: string;
}

interface CameraSettingsProps {
  camera: Camera;
  onClose: () => void;
  onSave: (data: Partial<Camera>) => Promise<void>;
  onDelete: () => Promise<void>;
}

const CameraSettings: React.FC<CameraSettingsProps> = ({
  camera,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    name: camera.name,
    location: camera.location,
    rtsp_url: camera.rtsp_url,
    username: camera.username || '',
    password: camera.password || '',
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTestStatus('idle');
    setError(null);
  };

  const testConnection = async () => {
    setTestStatus('testing');
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cameras/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rtsp_url: formData.rtsp_url,
          username: formData.username || undefined,
          password: formData.password || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to test connection');
      }

      setTestStatus('success');
    } catch (err) {
      setTestStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to test connection');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      try {
        await onDelete();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete camera');
      }
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <Dialog.Title className="text-xl font-bold mb-4">
            Camera Settings
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">RTSP URL</label>
              <input
                type="text"
                name="rtsp_url"
                value={formData.rtsp_url}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={testConnection}
                disabled={testStatus === 'testing'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>

              {testStatus === 'success' && (
                <span className="text-green-500">Connection successful!</span>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Camera
              </button>

              <div className="space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CameraSettings; 