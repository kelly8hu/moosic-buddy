# Backend Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your OpenAI API key:**
   Edit `.env` and add:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## Testing the Backend

### Test Chat Endpoint:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Install-ID: test-install-id-123" \
  -d '{
    "message": "What is a note?",
    "difficultyLevel": "10",
    "conversationHistory": [],
    "maxSentences": 4,
    "requireFollowUp": true
  }'
```

### Test Health Check:
```bash
curl http://localhost:3000/health
```

## Frontend Configuration

Once the backend is running, update your frontend `.env` file (in the root directory):

```
EXPO_PUBLIC_AI_API_URL=http://localhost:3000/api
EXPO_PUBLIC_USE_MOCK_API=false
```

Or if testing on a physical device, use your computer's IP address:
```
EXPO_PUBLIC_AI_API_URL=http://192.168.1.XXX:3000/api
```

## Production Deployment

For production, deploy the backend to a service like:
- **Vercel** (serverless functions)
- **Railway** (simple deployment)
- **Render** (free tier available)
- **Fly.io** (global deployment)

Update the frontend `EXPO_PUBLIC_AI_API_URL` to point to your production backend URL.

