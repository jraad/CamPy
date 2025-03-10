import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface AddCameraProps {
  onClose: () => void;
  onAdd: (data: NewCamera) => Promise<void>;
}

interface NewCamera {
  name: string;
  location: string;
  rtsp_url: string;
  username?: string;
  password?: string;
}

const AddCamera: React.FC<AddCameraProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<NewCamera>({
    name: '',
    location: '',
    rtsp_url: '',
    username: '',
    password: '',
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (testStatus !== 'success') {
      setError('Please test the connection before adding the camera');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdd(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add camera');
      setIsSubmitting(false);
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
            Add New Camera
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
                placeholder="Living Room Camera"
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
                placeholder="Living Room"
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
                placeholder="rtsp://camera-ip:554/stream"
              />
              <p className="text-gray-400 text-sm mt-1">
                Example: rtsp://192.168.1.100:554/h264Preview_01_main
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                placeholder="admin"
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
                placeholder="••••••••"
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
                disabled={testStatus === 'testing' || !formData.rtsp_url}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>

              {testStatus === 'success' && (
                <span className="text-green-500">Connection successful!</span>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || testStatus !== 'success'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Camera'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddCamera; 