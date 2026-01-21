import { AITutorResponse, PhotoCheckResponse, PhotoCheckRequest } from '../types';
import { getInstallId } from './installIdService';
import { API_CONFIG, shouldUseMockAPI } from '../utils/apiConfig';
import { MockAIService } from './mockAIService';

export class AIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  const delays = [1000, 2000, 4000, 8000]; // 1s, 2s, 4s, 8s
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Don't retry on client errors (4xx) except 429
      if (error instanceof AIError && error.statusCode && error.statusCode < 500 && error.statusCode !== 429) {
        throw error;
      }
      
      // Wait before retrying
      const delay = delays[attempt] || 8000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
}

export class AIService {
  /**
   * Send a chat message to the AI tutor
   */
  static async sendChatMessage(
    message: string,
    difficultyLevel: '7' | '10' | '13',
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<AITutorResponse> {
    // Use mock service if configured
    if (shouldUseMockAPI()) {
      return MockAIService.sendChatMessage(message, difficultyLevel, conversationHistory);
    }

    return retryWithBackoff(async () => {
      const installId = await getInstallId();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      try {
        const response = await Promise.race([
          fetch(`${API_CONFIG.baseUrl}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Install-ID': installId,
            },
            body: JSON.stringify({
              message,
              difficultyLevel,
              conversationHistory,
              maxSentences: 4,
              requireFollowUp: true,
            }),
            signal: controller.signal,
          }),
          createTimeout(API_CONFIG.timeout),
        ]);

        clearTimeout(timeoutId);

        if (!response.ok) {
          const retryAfter = response.headers.get('Retry-After');
          const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

          if (response.status === 429) {
            throw new AIError(
              'You\'ve asked lots of questions today! Take a break and come back tomorrow.',
              429,
              retryAfterSeconds
            );
          } else if (response.status === 503) {
            throw new AIError(
              'Our tutor is having trouble right now. Please try again later.',
              503
            );
          } else if (response.status === 400) {
            throw new AIError(
              'Something went wrong with your question. Please try rephrasing it.',
              400
            );
          } else if (response.status >= 500) {
            throw new AIError(
              'Our tutor is having trouble. Please try again.',
              response.status
            );
          } else {
            throw new AIError(
              'Failed to get AI response',
              response.status
            );
          }
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof AIError) {
          throw error;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new AIError('Having trouble connecting. Please check your internet.');
        }
        
        throw new AIError('Having trouble connecting. Please check your internet.');
      }
    });
  }

  /**
   * Check a photo of a worksheet problem
   */
  static async checkPhotoWork(request: PhotoCheckRequest): Promise<PhotoCheckResponse> {
    // Use mock service if configured
    if (shouldUseMockAPI()) {
      return MockAIService.checkPhotoWork(request);
    }

    return retryWithBackoff(async () => {
      const installId = await getInstallId();
      
      const formData = new FormData();
      formData.append('image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: 'worksheet.jpg',
      } as any);
      formData.append('problemType', request.problemType);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      try {
        const response = await Promise.race([
          fetch(`${API_CONFIG.baseUrl}/check-work`, {
            method: 'POST',
            body: formData,
            headers: {
              'X-Install-ID': installId,
            },
            signal: controller.signal,
          }),
          createTimeout(API_CONFIG.timeout),
        ]);

        clearTimeout(timeoutId);

        if (!response.ok) {
          const retryAfter = response.headers.get('Retry-After');
          const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

          if (response.status === 413) {
            throw new AIError(
              'Image is too large. Please try a smaller image.',
              413
            );
          } else if (response.status === 429) {
            throw new AIError(
              'You\'ve checked lots of worksheets today! Take a break and come back tomorrow.',
              429,
              retryAfterSeconds
            );
          } else if (response.status === 503) {
            throw new AIError(
              'Our tutor is having trouble right now. Please try again later.',
              503
            );
          } else if (response.status === 400) {
            throw new AIError(
              'Couldn\'t understand the image. Please try taking a clearer photo.',
              400
            );
          } else if (response.status >= 500) {
            throw new AIError(
              'Our tutor is having trouble. Please try again.',
              response.status
            );
          } else {
            throw new AIError(
              'Failed to check work',
              response.status
            );
          }
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof AIError) {
          throw error;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new AIError('Having trouble connecting. Please check your internet.');
        }
        
        throw new AIError('Having trouble connecting. Please check your internet.');
      }
    });
  }
}

