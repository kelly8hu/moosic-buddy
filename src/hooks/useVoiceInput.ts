import { useState, useCallback, useEffect } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import { VoiceService } from '../services/voiceService';
import * as Speech from 'expo-speech';

export interface UseVoiceInputReturn {
  isRecording: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearTranscript: () => void;
  clearError: () => void;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isRecording) {
        VoiceService.stopRecognition().catch(console.error);
      }
    };
  }, [isRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');

      // Check availability
      const isAvailable = await VoiceService.isAvailable();
      if (!isAvailable) {
        throw new Error('Speech recognition is not available');
      }

      // Request permission
      const hasPermission = await VoiceService.requestPermission();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      setIsRecording(true);

      // Start recognition
      await VoiceService.startRecognition({
        onResult: (result) => {
          setTranscript(result.text);
          if (result.isFinal) {
            setIsRecording(false);
          }
        },
        onError: (err) => {
          setIsRecording(false);
          if (err.message.includes('permission') || err.message.includes('Permission')) {
            setError('Microphone permission denied');
            Alert.alert(
              'Microphone Permission',
              'Moosic Buddy needs microphone access for voice input. Please enable it in Settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
          } else if (err.message.includes('network') || err.message.includes('Network')) {
            setError('Internet connection required for voice input');
          } else {
            setError('Couldn\'t understand. Try typing instead.');
          }
        },
        onEnd: () => {
          setIsRecording(false);
        },
      });
    } catch (err) {
      setIsRecording(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);

      if (errorMessage.includes('permission')) {
        Alert.alert(
          'Microphone Permission',
          'Moosic Buddy needs microphone access for voice input. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      await VoiceService.stopRecognition();
      setIsRecording(false);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setIsRecording(false);
    }
  }, []);

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    clearError,
  };
}

