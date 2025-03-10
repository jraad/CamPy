'use client';

import CameraGrid from '@/components/CameraGrid';

const testCameras = [
  {
    id: '1',
    name: 'Reolink Camera',
    streamUrl: 'test' // This matches our MediaMTX stream path
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-8">CamPy Dashboard</h1>
        <CameraGrid cameras={testCameras} />
      </div>
    </main>
  );
}
