# Backend API Setup - Quick Start Guide

## ✅ Backend is Ready!

A complete Node.js/Express backend server has been created in the `backend/` directory with OpenAI integration.

## 🚀 Getting Started

### Step 1: Set up the Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

4. **Add your OpenAI API key:**
   Edit `backend/.env` and add your key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Moosic Buddy Backend running on port 3000
   📝 Health check: http://localhost:3000/health
   💬 Chat endpoint: http://localhost:3000/api/chat
   📸 Photo check endpoint: http://localhost:3000/api/check-work
   ```

### Step 2: Configure the Frontend

1. **Create `.env` file in the root directory** (if it doesn't exist):
   ```bash
   # In the root directory (not backend/)
   EXPO_PUBLIC_AI_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_USE_MOCK_API=false
   ```

2. **Restart your Expo dev server:**
   - Stop the current server (Ctrl+C)
   - Start it again: `npm start`

### Step 3: Test It!

1. Open the app in Expo Go
2. Type a question like "What is a note?"
3. You should get a real AI response from OpenAI!

## 📱 Testing on Physical Device

If testing on a physical device (not simulator):

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Or check in System Settings > Network
   ```

2. Update frontend `.env`:
   ```
   EXPO_PUBLIC_AI_API_URL=http://YOUR_IP_ADDRESS:3000/api
   ```

3. Make sure your phone and computer are on the same WiFi network
4. Restart Expo server

## 🎯 What's Implemented

✅ **POST /api/chat** - AI tutor chat with:
- OpenAI GPT-4o-mini integration
- Age-appropriate prompts (7/10/13 difficulty levels)
- Rate limiting (50/hour per install_id)
- Structured JSON responses
- Follow-up questions
- Keyboard challenges

✅ **POST /api/check-work** - Photo analysis with:
- OpenAI Vision API (GPT-4o)
- Image validation
- Rate limiting (20/hour per install_id)
- Worksheet problem analysis

✅ **Rate Limiting:**
- 50 chat requests/hour
- 20 photo requests/hour  
- 200 total requests/day
- Per install_id tracking

✅ **Error Handling:**
- Proper HTTP status codes
- User-friendly error messages
- Retry-After headers for rate limits

## 🔧 Troubleshooting

**Backend won't start:**
- Check that port 3000 is not in use
- Verify `.env` file exists with `OPENAI_API_KEY`

**No responses in app:**
- Make sure backend is running (`npm run dev` in backend/)
- Check that frontend `.env` has correct URL
- Restart Expo server after changing `.env`

**CORS errors:**
- Backend CORS is set to allow all origins by default
- If issues persist, check `CORS_ORIGIN` in backend `.env`

## 📚 Next Steps

- Deploy backend to production (Vercel, Railway, Render, etc.)
- Update frontend `EXPO_PUBLIC_AI_API_URL` to production URL
- Consider upgrading to Redis for rate limiting in production
- Add logging and monitoring

