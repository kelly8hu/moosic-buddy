// Request Types
export interface ChatRequest {
  message: string;
  difficultyLevel: '7' | '10' | '13';
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxSentences: number;
  requireFollowUp: boolean;
}

export interface PhotoCheckRequest {
  image: Express.Multer.File;
  problemType: 'chord' | 'interval' | 'note' | 'key-signature';
}

// Response Types
export interface ChatResponse {
  explanation: string;
  followUpQuestions: string[];
  keyboardChallenge?: {
    type: 'note' | 'interval' | 'chord';
    description: string;
    targetNotes: string[];
  };
}

export interface PhotoCheckResponse {
  isCorrect: boolean;
  mistakes?: string[];
  explanation: string;
  followUpQuestion: string;
  keyboardChallenge?: {
    type: 'note' | 'interval' | 'chord';
    description: string;
    targetNotes: string[];
  };
  needsRetake?: boolean;
  retakeReason?: string;
}

// Rate Limiting
export interface RateLimitInfo {
  installId: string;
  chatCount: number;
  photoCount: number;
  dailyCount: number;
  lastReset: number;
}

