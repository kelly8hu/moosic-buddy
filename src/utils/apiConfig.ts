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
 */
export function shouldUseMockAPI(): boolean {
  return API_CONFIG.useMock || !API_CONFIG.baseUrl || API_CONFIG.baseUrl === '';
}

