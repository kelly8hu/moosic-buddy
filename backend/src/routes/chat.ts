import { Router, Request, Response } from 'express';
import { generateChatResponse } from '../services/openaiService';
import { chatRateLimiter } from '../middleware/rateLimiter';
import { ChatRequest } from '../types';

const router = Router();

/**
 * POST /chat - AI Tutor Chat Endpoint
 */
router.post('/chat', chatRateLimiter, async (req: Request, res: Response) => {
  try {
    // Validate request
    const { message, difficultyLevel, conversationHistory, maxSentences, requireFollowUp } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    if (!['7', '10', '13'].includes(difficultyLevel)) {
      return res.status(400).json({ error: 'Difficulty level must be "7", "10", or "13"' });
    }

    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: 'Conversation history must be an array' });
    }

    // Validate conversation history format
    for (const msg of conversationHistory) {
      if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
        return res.status(400).json({ error: 'Invalid message role in conversation history' });
      }
      if (!msg.content || typeof msg.content !== 'string') {
        return res.status(400).json({ error: 'Invalid message content in conversation history' });
      }
    }

    const request: ChatRequest = {
      message: message.trim(),
      difficultyLevel,
      conversationHistory,
      maxSentences: maxSentences || 4,
      requireFollowUp: requireFollowUp !== false,
    };

    // Generate response
    const response = await generateChatResponse(request);

    res.json(response);
  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    
    if (error instanceof Error) {
      // Check for OpenAI API errors
      if (error.message.includes('API key')) {
        return res.status(503).json({
          error: 'AI service configuration error',
          message: 'Our tutor is having trouble right now. Please try again later.',
        });
      }
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return res.status(503).json({
          error: 'AI service rate limit',
          message: 'Our tutor is very busy right now. Please try again in a moment.',
        });
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Our tutor is having trouble. Please try again.',
    });
  }
});

export default router;

