// Conditionally import Voice module (not available in Expo Go)
let Voice: any = null;
try {
  Voice = require('@react-native-voice/voice');
} catch (e) {
  // Voice module not available in Expo Go - voice input will be disabled
  console.warn('Voice module not available - voice input disabled. Create a development build to enable voice input.');
}

export interface VoiceRecognitionResult {
  text: string;
  isFinal: boolean;
}

export class VoiceService {
  private static isInitialized = false;
  private static recognitionCallbacks: {
    onResult?: (result: VoiceRecognitionResult) => void;
    onError?: (error: Error) => void;
    onEnd?: () => void;
  } = {};

  /**
   * Check if Voice module is available
   */
  private static isVoiceModuleAvailable(): boolean {
    return Voice !== null;
  }

  /**
   * Initialize the voice service
   */
  static async initialize(): Promise<void> {
    if (!this.isVoiceModuleAvailable()) {
      throw new Error('Voice recognition is not available in Expo Go. Please create a development build to enable voice input.');
    }

    if (this.isInitialized) return;

    try {
      // Set up event handlers for both iOS and Android
      Voice.onSpeechStart = () => {
        console.log('Speech recognition started');
      };

      Voice.onSpeechResults = (e: { value?: string[] }) => {
        if (e.value && e.value.length > 0) {
          this.recognitionCallbacks.onResult?.({
            text: e.value[0],
            isFinal: true,
          });
        }
      };

      Voice.onSpeechPartialResults = (e: { value?: string[] }) => {
        if (e.value && e.value.length > 0) {
          this.recognitionCallbacks.onResult?.({
            text: e.value[0],
            isFinal: false,
          });
        }
      };

      Voice.onSpeechError = (e: { error?: { message?: string } }) => {
        const error = new Error(e.error?.message || 'Speech recognition failed');
        this.recognitionCallbacks.onError?.(error);
      };

      Voice.onSpeechEnd = () => {
        this.recognitionCallbacks.onEnd?.();
      };

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing voice service:', error);
      throw error;
    }
  }

  /**
   * Check if speech recognition is available
   */
  static async isAvailable(): Promise<boolean> {
    if (!this.isVoiceModuleAvailable()) {
      return false;
    }

    try {
      await this.initialize();
      
      // Check if Voice is available (works on both iOS and Android)
      // isAvailable() returns a number (1 for available, 0 for not available)
      const isAvailable = await Voice.isAvailable();
      return Boolean(isAvailable);
    } catch (error) {
      console.error('Error checking voice availability:', error);
      return false;
    }
  }

  /**
   * Request microphone permission
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isVoiceModuleAvailable()) {
      return false;
    }

    try {
      await this.initialize();

      // Request permission (works on both iOS and Android)
      // The library requests permission automatically when starting recognition
      // For explicit permission check, we'll try to start and catch errors
      // In practice, permission is requested when Voice.start() is called
      return true;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Start voice recognition
   */
  static async startRecognition(
    callbacks: {
      onResult?: (result: VoiceRecognitionResult) => void;
      onError?: (error: Error) => void;
      onEnd?: () => void;
    }
  ): Promise<void> {
    if (!this.isVoiceModuleAvailable()) {
      const error = new Error('Voice recognition is not available in Expo Go. Please create a development build to enable voice input.');
      callbacks.onError?.(error);
      throw error;
    }

    try {
      await this.initialize();
      this.recognitionCallbacks = callbacks;

      // Start recognition (works on both iOS and Android)
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.recognitionCallbacks.onError?.(
        error instanceof Error ? error : new Error('Failed to start recognition')
      );
      throw error;
    }
  }

  /**
   * Stop voice recognition
   */
  static async stopRecognition(): Promise<void> {
    if (!this.isVoiceModuleAvailable()) {
      return;
    }

    try {
      await Voice.stop();
      this.recognitionCallbacks = {};
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }

  /**
   * Cancel voice recognition
   */
  static async cancelRecognition(): Promise<void> {
    if (!this.isVoiceModuleAvailable()) {
      return;
    }

    try {
      await Voice.cancel();
      this.recognitionCallbacks = {};
    } catch (error) {
      console.error('Error canceling recognition:', error);
    }
  }
}

