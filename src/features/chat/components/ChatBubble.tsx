import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '../../../types';
import { COLORS } from '../../../utils/constants';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <Text
        style={[
          styles.text,
          isUser ? styles.userText : styles.assistantText,
        ]}
      >
        {message.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.border,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: COLORS.text,
  },
});

