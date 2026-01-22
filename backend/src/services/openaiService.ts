import OpenAI from 'openai';
import { ChatRequest, PhotoCheckRequest, ChatResponse, PhotoCheckResponse } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get system prompt based on difficulty level
 */
function getSystemPrompt(difficultyLevel: '7' | '10' | '13'): string {
  const basePrompt = `You are Moosic Buddy, a friendly and encouraging music theory tutor for children. Your goal is to help kids ages 7-13 learn music theory in a fun, approachable way.

Guidelines:
- Always be encouraging and positive
- Use age-appropriate language
- Keep explanations concise (maximum 4 sentences)
- Always provide 1-2 follow-up questions to encourage learning
- Use simple analogies when explaining concepts
- Be patient and supportive`;

  if (difficultyLevel === '7') {
    return `${basePrompt}

Age 7 Specific:
- Use very simple language
- Explain like talking to a 7-year-old
- Use lots of analogies and examples
- Keep sentences short
- Use emojis occasionally to make it fun`;
  } else if (difficultyLevel === '10') {
    return `${basePrompt}

Age 10 Specific:
- Use clear, straightforward language
- Explain concepts with examples
- Can use some music theory terms but explain them
- Balance simplicity with accuracy`;
  } else {
    return `${basePrompt}

Age 13 Specific:
- Can use proper music theory terminology
- More detailed explanations
- Can discuss relationships between concepts
- Still keep it engaging and not overly academic`;
  }
}

/**
 * Generate chat response using OpenAI
 */
export async function generateChatResponse(
  request: ChatRequest
): Promise<ChatResponse> {
  const systemPrompt = getSystemPrompt(request.difficultyLevel);

  // Build conversation messages with JSON format instruction
  const jsonInstruction = `\n\nIMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "explanation": "Your explanation here (max ${request.maxSentences} sentences)",
  "followUpQuestions": ["Question 1", "Question 2"],
  "keyboardChallenge": {
    "type": "note" | "interval" | "chord",
    "description": "Description of the challenge",
    "targetNotes": ["C4", "E4", "G4"]
  }
}
The keyboardChallenge field is optional.`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt + jsonInstruction,
    },
    ...request.conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    {
      role: 'user',
      content: request.message,
    },
  ];

  // Request structured output
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Using mini for cost efficiency, can upgrade to gpt-4o if needed
    messages,
    temperature: 0.7,
    max_tokens: 300, // Limit to keep responses concise
    response_format: {
      type: 'json_object',
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsed = JSON.parse(content);
    
    // Validate and format response
    const response: ChatResponse = {
      explanation: parsed.explanation || 'I\'m here to help you learn music theory!',
      followUpQuestions: Array.isArray(parsed.followUpQuestions) 
        ? parsed.followUpQuestions.slice(0, 2) 
        : ['What would you like to learn more about?'],
      keyboardChallenge: parsed.keyboardChallenge || undefined,
    };

    // Enforce max sentences (rough check)
    const sentences = response.explanation.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > request.maxSentences) {
      response.explanation = sentences.slice(0, request.maxSentences).join('. ') + '.';
    }

    return response;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    // Fallback response
    return {
      explanation: 'I\'m here to help you learn music theory! What would you like to know?',
      followUpQuestions: ['What would you like to learn more about?'],
    };
  }
}

/**
 * Analyze photo of worksheet using OpenAI Vision
 */
export async function analyzePhotoWork(
  request: PhotoCheckRequest
): Promise<PhotoCheckResponse> {
  // Convert image to base64
  const imageBase64 = request.image.buffer.toString('base64');
  const imageMimeType = request.image.mimetype || 'image/jpeg';

  const systemPrompt = `You are Moosic Buddy, a friendly music theory tutor helping children check their worksheet answers.

Analyze the uploaded image of a music theory worksheet problem. The problem type is: ${request.problemType}.

Respond in JSON format with this structure:
{
  "isCorrect": true/false,
  "mistakes": ["mistake 1", "mistake 2"] (only if isCorrect is false),
  "explanation": "Brief, encouraging explanation (max 3 sentences)",
  "followUpQuestion": "A question to help them learn",
  "keyboardChallenge": {
    "type": "note" | "interval" | "chord",
    "description": "Description",
    "targetNotes": ["C4", "E4"]
  } (optional),
  "needsRetake": true/false (only if image is unclear),
  "retakeReason": "Reason why retake is needed" (only if needsRetake is true)
}

Be encouraging and supportive. If the image is unclear or you cannot determine the answer, set needsRetake: true with a reason.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o', // Use vision-capable model
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Please analyze this ${request.problemType} problem on the worksheet.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageMimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    temperature: 0.3, // Lower temperature for more consistent analysis
    max_tokens: 400,
    response_format: {
      type: 'json_object',
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsed = JSON.parse(content);
    
    return {
      isCorrect: parsed.isCorrect ?? false,
      mistakes: parsed.mistakes || undefined,
      explanation: parsed.explanation || 'I\'ve reviewed your work!',
      followUpQuestion: parsed.followUpQuestion || 'Would you like to try another problem?',
      keyboardChallenge: parsed.keyboardChallenge || undefined,
      needsRetake: parsed.needsRetake || false,
      retakeReason: parsed.retakeReason || undefined,
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to analyze worksheet');
  }
}

