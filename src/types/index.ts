// User and Progress Types
export interface UserProgress {
  streak: number;
  badges: Badge[];
  totalSessions: number;
  lastSessionDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  icon: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  difficultyLevel?: '7' | '10' | '13';
}

export interface AITutorResponse {
  explanation: string;
  followUpQuestions: string[];
  keyboardChallenge?: KeyboardChallenge;
}

// Keyboard Types
export interface KeyboardChallenge {
  type: 'note' | 'interval' | 'chord';
  description: string;
  targetNotes: string[];
}

export interface Note {
  name: string;
  octave: number;
  frequency: number;
}

// Photo Check Types
export interface PhotoCheckRequest {
  imageUri: string;
  problemType: 'chord' | 'interval' | 'note' | 'key-signature';
}

export interface PhotoCheckResponse {
  isCorrect: boolean;
  mistakes?: string[];
  explanation: string;
  followUpQuestion: string;
  keyboardChallenge?: KeyboardChallenge;
  needsRetake?: boolean;
  retakeReason?: string;
}

// Settings Types
export interface AppSettings {
  autoReadEnabled: boolean;
  difficultyLevel: '7' | '10' | '13';
  soundEnabled: boolean;
  noteLabelsEnabled: boolean;
}

