import { AITutorResponse, PhotoCheckResponse, PhotoCheckRequest } from '../types';

// TODO: Replace with actual AI service integration (OpenAI, Anthropic, etc.)
const API_BASE_URL = process.env.EXPO_PUBLIC_AI_API_URL || '';

export class AIService {
  /**
   * Send a chat message to the AI tutor
   */
  static async sendChatMessage(
    message: string,
    difficultyLevel: '7' | '10' | '13',
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<AITutorResponse> {
    // TODO: Implement actual API call
    // This is a placeholder structure
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        difficultyLevel,
        conversationHistory,
        maxSentences: 4,
        requireFollowUp: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    return response.json();
  }

  /**
   * Check a photo of a worksheet problem
   */
  static async checkPhotoWork(request: PhotoCheckRequest): Promise<PhotoCheckResponse> {
    // TODO: Implement actual API call with image upload
    const formData = new FormData();
    formData.append('image', {
      uri: request.imageUri,
      type: 'image/jpeg',
      name: 'worksheet.jpg',
    } as any);
    formData.append('problemType', request.problemType);

    const response = await fetch(`${API_BASE_URL}/check-work`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check work');
    }

    return response.json();
  }
}

