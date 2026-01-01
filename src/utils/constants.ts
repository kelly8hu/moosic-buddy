// App Constants
export const APP_NAME = 'Moosic Buddy';
export const MASCOT_EMOJI = '🐄';

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  AGE_7: '7',
  AGE_10: '10',
  AGE_13: '13',
} as const;

// Audio Constants
export const AUDIO_LATENCY_TARGET_MS = 150;
export const DEFAULT_OCTAVES = 2;

// Progress Constants
export const STREAK_RESET_HOURS = 24;

// UI Constants
export const COLORS = {
  primary: '#4A90E2',
  secondary: '#50C878',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
} as const;

// Problem Types
export const PROBLEM_TYPES = {
  CHORD: 'chord',
  INTERVAL: 'interval',
  NOTE: 'note',
  KEY_SIGNATURE: 'key-signature',
} as const;

