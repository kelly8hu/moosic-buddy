# Moosic Buddy Backend API

Backend server for Moosic Buddy app using OpenAI API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm run build
npm start
```

## Environment Variables

- `OPENAI_API_KEY` (required) - Your OpenAI API key
- `PORT` (optional) - Server port (default: 3000)
- `NODE_ENV` (optional) - Environment (development/production)
- `CORS_ORIGIN` (optional) - CORS origin (default: *)
- `RATE_LIMIT_CHAT_MAX` (optional) - Chat requests per hour (default: 50)
- `RATE_LIMIT_PHOTO_MAX` (optional) - Photo requests per hour (default: 20)
- `RATE_LIMIT_DAILY_MAX` (optional) - Total requests per day (default: 200)

## API Endpoints

### POST /api/chat
AI tutor chat endpoint.

**Headers:**
- `Content-Type: application/json`
- `X-Install-ID: <uuid>` (required)

**Request Body:**
```json
{
  "message": "What is a note?",
  "difficultyLevel": "10",
  "conversationHistory": [],
  "maxSentences": 4,
  "requireFollowUp": true
}
```

**Response:**
```json
{
  "explanation": "...",
  "followUpQuestions": ["...", "..."],
  "keyboardChallenge": { ... }
}
```

### POST /api/check-work
Photo worksheet analysis endpoint.

**Headers:**
- `Content-Type: multipart/form-data`
- `X-Install-ID: <uuid>` (required)

**Form Data:**
- `image`: Image file (JPEG/PNG, max 2MB)
- `problemType`: "chord" | "interval" | "note" | "key-signature"

**Response:**
```json
{
  "isCorrect": true,
  "explanation": "...",
  "followUpQuestion": "...",
  "keyboardChallenge": { ... }
}
```

## Rate Limiting

- Chat: 50 requests/hour per install_id
- Photo: 20 requests/hour per install_id
- Daily: 200 total requests/day per install_id

Rate limit exceeded returns `429 Too Many Requests` with `Retry-After` header.

## Development

The server uses TypeScript and compiles to `dist/` directory. For development, use `npm run dev` which uses `tsx` for hot reloading.

## Production Notes

- Use Redis or a database for rate limiting in production (currently in-memory)
- Add proper logging (Winston, Pino, etc.)
- Set up monitoring and error tracking
- Use environment-specific configurations
- Consider using a reverse proxy (nginx) for production

