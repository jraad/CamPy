import React from 'react';
import './App.css';
import VideoStream from './components/VideoStream';

function App() {
  const API_BASE_URL = 'http://localhost:8000/api/stream';

  return (
    <div className="App">
      <header className="App-header">
        <h1>CamPy RTSP Viewer</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <VideoStream apiBaseUrl={API_BASE_URL} />
      </main>
    </div>
  );
}

export default App;
