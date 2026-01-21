import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const INSTALL_ID_KEY = '@moosic_buddy:install_id';

/**
 * Get or generate the install ID for this app installation.
 * The install ID is a UUID v4 that persists across app updates
 * and only resets on full uninstall.
 */
export async function getInstallId(): Promise<string> {
  try {
    // Check if install ID already exists
    const existingId = await AsyncStorage.getItem(INSTALL_ID_KEY);
    if (existingId) {
      return existingId;
    }

    // Generate new UUID v4
    const newId = await Crypto.randomUUID();
    
    // Store it for future use
    await AsyncStorage.setItem(INSTALL_ID_KEY, newId);
    
    return newId;
  } catch (error) {
    console.error('Error getting install ID:', error);
    // Fallback: generate a temporary ID (won't persist, but allows app to function)
    return await Crypto.randomUUID();
  }
}

/**
 * Clear the install ID (useful for testing or reset scenarios)
 */
export async function clearInstallId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(INSTALL_ID_KEY);
  } catch (error) {
    console.error('Error clearing install ID:', error);
  }
}

