import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { StorageService } from '../services/storageService';

const DEFAULT_SETTINGS: AppSettings = {
  autoReadEnabled: false,
  difficultyLevel: '10',
  soundEnabled: true,
  noteLabelsEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await StorageService.getSettings();
      if (data) {
        setSettings(data);
      } else {
        // Use defaults
        setSettings(DEFAULT_SETTINGS);
        await StorageService.saveSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  };

  return {
    settings,
    loading,
    updateSettings,
  };
}

