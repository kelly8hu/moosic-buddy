import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, AppSettings, ChatMessage } from '../types';

const STORAGE_KEYS = {
  USER_PROGRESS: '@moosic_buddy:user_progress',
  SETTINGS: '@moosic_buddy:settings',
  CHAT_HISTORY: '@moosic_buddy:chat_history',
};

export class StorageService {
  /**
   * Get user progress
   */
  static async getProgress(): Promise<UserProgress | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  /**
   * Save user progress
   */
  static async saveProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  /**
   * Get app settings
   */
  static async getSettings(): Promise<AppSettings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  /**
   * Save app settings
   */
  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Get chat history
   */
  static async getChatHistory(): Promise<ChatMessage[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  /**
   * Save chat history
   */
  static async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      // Convert Date objects to ISO strings for storage
      const serialized = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date 
          ? msg.timestamp.toISOString() 
          : msg.timestamp,
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  /**
   * Clear all data
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

