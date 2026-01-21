import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceInput } from '../../../hooks/useVoiceInput';
import { COLORS } from '../../../utils/constants';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const {
    isRecording,
    transcript,
    error: voiceError,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useVoiceInput();

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Auto-send when recording stops and transcript is final
  useEffect(() => {
    if (!isRecording && transcript && transcript.trim()) {
      // Small delay to allow user to edit
      const timer = setTimeout(() => {
        // Don't auto-send, let user review and send manually
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isRecording, transcript]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      clearTranscript();
    }
  };

  const handleVoicePressIn = async () => {
    if (!disabled) {
      await startRecording();
    }
  };

  const handleVoicePressOut = async () => {
    await stopRecording();
  };

  return (
    <View style={styles.container}>
      {voiceError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{voiceError}</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me about music theory..."
          placeholderTextColor="#8E8E93"
          multiline
          editable={!disabled}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonRecording,
            ]}
            onPressIn={handleVoicePressIn}
            onPressOut={handleVoicePressOut}
            disabled={disabled}
            accessibilityLabel="Hold to record voice"
          >
            <Ionicons
              name={isRecording ? 'mic' : 'mic-outline'}
              size={24}
              color={isRecording ? '#FFFFFF' : COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, (!message.trim() || disabled) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim() || disabled}
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Listening...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  errorContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    fontSize: 16,
    color: '#1A1A1A',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  voiceButtonRecording: {
    backgroundColor: COLORS.error,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    marginRight: 8,
  },
  recordingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

