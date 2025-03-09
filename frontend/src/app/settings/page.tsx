'use client';

import { useState } from 'react';

type SettingsSection = 'cameras' | 'storage' | 'system' | 'network';

interface Settings {
  cameras: {
    defaultQuality: 'high' | 'medium' | 'low';
    motionSensitivity: number;
  };
  storage: {
    location: string;
    retentionDays: number;
  };
  system: {
    autostart: boolean;
    logLevel: 'debug' | 'info' | 'warning' | 'error';
  };
  network: {
    iceServers: string;
    interface: string;
  };
}

const defaultSettings: Settings = {
  cameras: {
    defaultQuality: 'high',
    motionSensitivity: 50,
  },
  storage: {
    location: '/opt/campy/storage',
    retentionDays: 30,
  },
  system: {
    autostart: true,
    logLevel: 'info',
  },
  network: {
    iceServers: 'stun:stun.l.google.com:19302',
    interface: 'auto',
  },
};

function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('cameras');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const sections: { id: SettingsSection; label: string; icon: string }[] = [
    { id: 'cameras', label: 'Camera Settings', icon: '📹' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'system', label: 'System', icon: '⚙️' },
    { id: 'network', label: 'Network', icon: '🌐' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Send settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = <K extends keyof Settings, SK extends keyof Settings[K]>(
    section: K,
    key: SK,
    value: Settings[K][SK]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <nav className="w-full md:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="mr-3">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        {/* Settings Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeSection === 'cameras' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Camera Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Stream Quality</label>
                  <select 
                    value={settings.cameras.defaultQuality}
                    onChange={(e) => updateSettings('cameras', 'defaultQuality', e.target.value as Settings['cameras']['defaultQuality'])}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value="high">High (1080p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="low">Low (480p)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Motion Detection Sensitivity: {settings.cameras.motionSensitivity}
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="100"
                    value={settings.cameras.motionSensitivity}
                    onChange={(e) => updateSettings('cameras', 'motionSensitivity', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'storage' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Storage Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Location</label>
                  <input 
                    type="text" 
                    value={settings.storage.location}
                    onChange={(e) => updateSettings('storage', 'location', e.target.value)}
                    placeholder="/path/to/storage"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Retention Period (days)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={settings.storage.retentionDays}
                    onChange={(e) => updateSettings('storage', 'retentionDays', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="autostart"
                    checked={settings.system.autostart}
                    onChange={(e) => updateSettings('system', 'autostart', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                  />
                  <label htmlFor="autostart" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Start on system boot
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">System Log Level</label>
                  <select 
                    value={settings.system.logLevel}
                    onChange={(e) => updateSettings('system', 'logLevel', e.target.value as Settings['system']['logLevel'])}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'network' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Network Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">WebRTC ICE Servers</label>
                  <textarea 
                    rows={4}
                    value={settings.network.iceServers}
                    onChange={(e) => updateSettings('network', 'iceServers', e.target.value)}
                    placeholder="STUN/TURN server URLs"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Interface</label>
                  <select 
                    value={settings.network.interface}
                    onChange={(e) => updateSettings('network', 'interface', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="eth0">Ethernet (eth0)</option>
                    <option value="wlan0">Wireless (wlan0)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md transition-colors ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 