import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage as ChatMessageType } from '../../../types';
import { ChatBubble } from './ChatBubble';
import { Mascot } from '../../../components/Mascot';
import { COLORS } from '../../../utils/constants';
import { TTSService } from '../../../services/ttsService';
import { useSettings } from '../../../hooks/useSettings';

interface ChatMessageProps {
  message: ChatMessageType;
  onFollowUpClick?: (question: string) => void;
}

export function ChatMessage({
  message,
  onFollowUpClick,
}: ChatMessageProps) {
  const { followUpQuestions, keyboardChallenge } = message;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { settings } = useSettings();
  const isAssistant = message.role === 'assistant';

  // Auto-read if enabled and this is a new assistant message
  useEffect(() => {
    if (
      isAssistant &&
      settings.autoReadEnabled &&
      !isSpeaking &&
      message.content
    ) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        handleSpeak();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAssistant, settings.autoReadEnabled, message.id]);

  const handleSpeak = async () => {
    if (isSpeaking) {
      await TTSService.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await TTSService.speak(message.content, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          setIsSpeaking(false);
        },
        onStopped: () => {
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  if (message.role === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <ChatBubble message={message} />
      </View>
    );
  }

  return (
    <View style={styles.assistantMessageContainer}>
      <View style={styles.mascotContainer}>
        <Mascot size={40} />
      </View>
      <View style={styles.messageContent}>
        <ChatBubble message={message} />
        
        {/* TTS Button */}
        <TouchableOpacity
          style={styles.ttsButton}
          onPress={handleSpeak}
          accessibilityLabel="Read message aloud"
        >
          <Ionicons
            name={isSpeaking ? 'stop-circle' : 'volume-high'}
            size={20}
            color={isSpeaking ? COLORS.error : COLORS.primary}
          />
          <Text style={styles.ttsButtonText}>
            {isSpeaking ? 'Stop' : 'Read'}
          </Text>
        </TouchableOpacity>

        {/* Follow-up Questions */}
        {followUpQuestions && followUpQuestions.length > 0 && (
          <View style={styles.followUpContainer}>
            <Text style={styles.followUpLabel}>Try asking:</Text>
            {followUpQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.followUpButton}
                onPress={() => onFollowUpClick?.(question)}
              >
                <Text style={styles.followUpText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Keyboard Challenge */}
        {keyboardChallenge && (
          <View style={styles.challengeContainer}>
            <Text style={styles.challengeLabel}>🎹 Try it:</Text>
            <Text style={styles.challengeText}>
              {keyboardChallenge.description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  assistantMessageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  mascotContainer: {
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  ttsButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  followUpContainer: {
    marginTop: 12,
  },
  followUpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  followUpButton: {
    backgroundColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  followUpText: {
    fontSize: 14,
    color: COLORS.text,
  },
  challengeContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  challengeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  challengeText: {
    fontSize: 14,
    color: COLORS.text,
  },
});

