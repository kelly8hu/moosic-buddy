/**
 * API Configuration
 * Reads environment variables for API endpoint configuration
 */

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_AI_API_URL || 'http://localhost:3000/api',
  useMock: process.env.EXPO_PUBLIC_USE_MOCK_API === 'true',
  timeout: 30000, // 30 seconds
} as const;

/**
 * Check if mock API should be used
 * Only use mock if explicitly set to true, or if baseUrl is empty/undefined
 */
export function shouldUseMockAPI(): boolean {
  // Use mock only if explicitly enabled OR if no baseUrl is set
  if (API_CONFIG.useMock) {
    return true;
  }
  // If baseUrl is empty or just the default localhost, check if we should use mock
  if (!API_CONFIG.baseUrl || API_CONFIG.baseUrl === '' || API_CONFIG.baseUrl === 'http://localhost:3000/api') {
    // Default to real API if localhost is set (backend might be running)
    // Only use mock if explicitly disabled or no URL provided
    return false; // Try real API first
  }
  return false;
}

