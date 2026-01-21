import * as Speech from 'expo-speech';

export interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}

export class TTSService {
  private static currentSpeechId: string | null = null;

  /**
   * Speak text using text-to-speech
   */
  static async speak(
    text: string,
    options: TTSOptions = {}
  ): Promise<void> {
    try {
      // Stop any current speech
      await this.stop();

      const {
        language = 'en-US',
        pitch = 1.0,
        rate = 0.9,
        onDone,
        onStopped,
        onError,
      } = options;

      // Generate a unique ID for this speech
      this.currentSpeechId = Date.now().toString();

      await Speech.speak(text, {
        language,
        pitch,
        rate,
        onDone: () => {
          this.currentSpeechId = null;
          onDone?.();
        },
        onStopped: () => {
          this.currentSpeechId = null;
          onStopped?.();
        },
        onError: (error) => {
          this.currentSpeechId = null;
          const errorMessage = typeof error === 'string' ? error : 'TTS error occurred';
          onError?.(new Error(errorMessage));
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }

  /**
   * Stop current speech
   */
  static async stop(): Promise<void> {
    try {
      if (this.currentSpeechId !== null) {
        Speech.stop();
        this.currentSpeechId = null;
      }
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  }

  /**
   * Check if speech is currently playing
   */
  static isSpeaking(): boolean {
    return this.currentSpeechId !== null;
  }
}

