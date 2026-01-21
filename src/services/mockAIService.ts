import { AITutorResponse, PhotoCheckResponse, PhotoCheckRequest } from '../types';

/**
 * Mock AI Service for development without backend
 * Returns realistic responses matching the API contract
 */

const MOCK_DELAY_MS = 1000; // Simulate network delay

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MockAIService {
  /**
   * Send a chat message to the AI tutor (mock)
   */
  static async sendChatMessage(
    message: string,
    difficultyLevel: '7' | '10' | '13',
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<AITutorResponse> {
    await delay(MOCK_DELAY_MS);

    // Simple mock responses based on message content
    const lowerMessage = message.toLowerCase();
    
    let explanation = '';
    let followUpQuestions: string[] = [];
    let keyboardChallenge;

    if (lowerMessage.includes('note') || lowerMessage.includes('what is a note')) {
      if (difficultyLevel === '7') {
        explanation = 'A note is like a building block of music! It\'s a sound that has a name, like C, D, E, F, G, A, or B. When you press a key on a piano, you play a note.';
      } else if (difficultyLevel === '10') {
        explanation = 'A note is a musical sound with a specific pitch. Notes are named using letters A through G, and they can be sharp or flat. Each note has a frequency that determines how high or low it sounds.';
      } else {
        explanation = 'A note is a fundamental unit of music representing a specific pitch. Notes are identified by letter names (A-G) and can be modified with accidentals (sharps and flats). The frequency of a note determines its pitch, measured in Hertz (Hz).';
      }
      followUpQuestions = [
        'Can you name all the notes in the C major scale?',
        'What\'s the difference between a sharp and a flat note?'
      ];
      keyboardChallenge = {
        type: 'note' as const,
        description: 'Try playing the note C on the keyboard!',
        targetNotes: ['C4']
      };
    } else if (lowerMessage.includes('chord') || lowerMessage.includes('what is a chord')) {
      if (difficultyLevel === '7') {
        explanation = 'A chord is when you play three or more notes together at the same time! It sounds really nice and full. Like when you play C, E, and G together, that\'s a C major chord.';
      } else if (difficultyLevel === '10') {
        explanation = 'A chord is a combination of three or more notes played simultaneously. The most common chords are triads, which consist of a root note, a third, and a fifth. Chords create harmony in music.';
      } else {
        explanation = 'A chord is a harmonic set of three or more notes played simultaneously. Triads consist of a root, third, and fifth interval. Chords are classified by their quality (major, minor, diminished, augmented) and function within a key.';
      }
      followUpQuestions = [
        'What notes make up a C major chord?',
        'Can you explain the difference between major and minor chords?'
      ];
      keyboardChallenge = {
        type: 'chord' as const,
        description: 'Try playing a C major chord (C, E, G)!',
        targetNotes: ['C4', 'E4', 'G4']
      };
    } else if (lowerMessage.includes('interval') || lowerMessage.includes('what is an interval')) {
      if (difficultyLevel === '7') {
        explanation = 'An interval is the distance between two notes! Like if you go from C to E, that\'s an interval. Some intervals sound happy, and some sound sad.';
      } else if (difficultyLevel === '10') {
        explanation = 'An interval is the distance between two musical notes, measured in semitones or steps. Intervals are named by their size (second, third, fourth, etc.) and quality (major, minor, perfect).';
      } else {
        explanation = 'An interval is the pitch distance between two notes, measured in semitones. Intervals are classified by size (unison, second, third, fourth, fifth, sixth, seventh, octave) and quality (perfect, major, minor, diminished, augmented).';
      }
      followUpQuestions = [
        'What\'s the interval between C and E?',
        'Can you name a perfect interval?'
      ];
      keyboardChallenge = {
        type: 'interval' as const,
        description: 'Try playing a major third interval (C to E)!',
        targetNotes: ['C4', 'E4']
      };
    } else {
      // Generic response
      if (difficultyLevel === '7') {
        explanation = 'That\'s a great question about music! Music theory helps us understand how music works. Would you like to learn more about notes, chords, or intervals?';
      } else if (difficultyLevel === '10') {
        explanation = 'Music theory is the study of how music works, including scales, chords, intervals, and rhythm. It helps us understand the patterns and structures in music.';
      } else {
        explanation = 'Music theory encompasses the study of musical elements including harmony, melody, rhythm, form, and structure. It provides a framework for understanding and analyzing music.';
      }
      followUpQuestions = [
        'What would you like to learn more about?',
        'Do you have a specific question about music theory?'
      ];
    }

    return {
      explanation,
      followUpQuestions,
      keyboardChallenge,
    };
  }

  /**
   * Check a photo of a worksheet problem (mock)
   */
  static async checkPhotoWork(request: PhotoCheckRequest): Promise<PhotoCheckResponse> {
    await delay(MOCK_DELAY_MS * 2); // Longer delay for image processing

    // Mock response - always returns correct for development
    return {
      isCorrect: true,
      explanation: 'Great job! Your answer looks correct. You\'ve identified the notes/chords/intervals correctly.',
      followUpQuestion: 'Can you try playing this on the keyboard?',
      keyboardChallenge: {
        type: 'note' as const,
        description: 'Try playing the notes you identified!',
        targetNotes: ['C4', 'E4', 'G4']
      }
    };
  }
}

