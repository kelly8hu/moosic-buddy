import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { StorageService } from '../services/storageService';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await StorageService.getProgress();
      if (data) {
        setProgress(data);
      } else {
        // Initialize default progress
        const defaultProgress: UserProgress = {
          streak: 0,
          badges: [],
          totalSessions: 0,
          lastSessionDate: null,
        };
        setProgress(defaultProgress);
        await StorageService.saveProgress(defaultProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    if (!progress) return;

    const now = new Date();
    const lastDate = progress.lastSessionDate ? new Date(progress.lastSessionDate) : null;
    
    let newStreak = progress.streak;
    
    if (!lastDate) {
      // First session
      newStreak = 1;
    } else {
      const hoursSinceLastSession = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastSession < 24) {
        // Same day, don't increment
        newStreak = progress.streak;
      } else if (hoursSinceLastSession < 48) {
        // Next day, increment streak
        newStreak = progress.streak + 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }
    }

    const updatedProgress: UserProgress = {
      ...progress,
      streak: newStreak,
      totalSessions: progress.totalSessions + 1,
      lastSessionDate: now.toISOString(),
    };

    setProgress(updatedProgress);
    await StorageService.saveProgress(updatedProgress);
  };

  const addBadge = async (badgeId: string, badgeName: string, badgeDescription: string) => {
    if (!progress) return;

    const newBadge = {
      id: badgeId,
      name: badgeName,
      description: badgeDescription,
      earnedDate: new Date().toISOString(),
      icon: '🏆',
    };

    const updatedProgress: UserProgress = {
      ...progress,
      badges: [...progress.badges, newBadge],
    };

    setProgress(updatedProgress);
    await StorageService.saveProgress(updatedProgress);
  };

  return {
    progress,
    loading,
    updateStreak,
    addBadge,
    refresh: loadProgress,
  };
}

