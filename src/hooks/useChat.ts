import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, AITutorResponse } from '../types';
import { AIService } from '../services/aiService';
import { StorageService } from '../services/storageService';
import { useSettings } from './useSettings';
import { useProgress } from './useProgress';

const MAX_CONTEXT_MESSAGES = 20;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const { updateStreak } = useProgress();

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await StorageService.getChatHistory();
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    try {
      await StorageService.saveChatHistory(newMessages);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      difficultyLevel: settings.difficultyLevel,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setError(null);
    await saveChatHistory(newMessages);

    try {
      // Prepare conversation history (last 20 messages for context)
      const contextMessages = newMessages.slice(-MAX_CONTEXT_MESSAGES).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response: AITutorResponse = await AIService.sendChatMessage(
        content.trim(),
        settings.difficultyLevel,
        contextMessages
      );

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response.explanation,
        timestamp: new Date(),
        difficultyLevel: settings.difficultyLevel,
        followUpQuestions: response.followUpQuestions,
        keyboardChallenge: response.keyboardChallenge,
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      await saveChatHistory(updatedMessages);

      // Update streak after successful interaction
      await updateStreak();
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, settings.difficultyLevel, updateStreak]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearError,
  };
}

