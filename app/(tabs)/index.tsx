import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../../src/features/chat/components/ChatInput';
import { ChatMessage } from '../../src/features/chat/components/ChatMessage';
import { Mascot } from '../../src/components/Mascot';
import { useChat } from '../../src/hooks/useChat';
import { COLORS } from '../../src/utils/constants';
import { AIError } from '../../src/services/aiService';

export default function ChatScreen() {
  const { messages, loading, error, sendMessage, clearError } = useChat();
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Oops!',
        error,
        [
          {
            text: 'OK',
            onPress: clearError,
          },
        ]
      );
    }
  }, [error, clearError]);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (err) {
      // Error is handled by useChat hook
      console.error('Error in handleSendMessage:', err);
    }
  };

  const handleFollowUpClick = async (question: string) => {
    await handleSendMessage(question);
  };


  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    return (
      <ChatMessage
        message={item}
        onFollowUpClick={handleFollowUpClick}
      />
    );
  };

  const renderHeader = () => {
    if (messages.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Mascot size={100} />
          <Text style={styles.welcomeTitle}>Welcome to Moosic Buddy! 🐄</Text>
          <Text style={styles.welcomeSubtitle}>
            Ask me anything about music theory, and I'll help you learn!
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Mascot size={40} listening={true} />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Moosic Buddy</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  messagesContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

