# Moosic Buddy – Product Requirements Document (PRD)

## Product Name
**Moosic Buddy**

## Mascot
A cute cartoon cow 🐄  
(Friendly, expressive, kid-safe)

## Platforms
- iOS (iPad, iPhone)
- Android (Tablet, Phone)

## App Category
Education (Kid-friendly, privacy-first)

---

## 1. Problem Statement

Music theory is often abstract, worksheet-heavy, and lacks immediate feedback outside of lessons. Children struggle to stay engaged, understand mistakes, and practice independently.

**Moosic Buddy** is an interactive AI-powered music tutor that:
- Explains music theory in simple, age-appropriate language
- Confirms understanding through follow-up questions
- Encourages hands-on learning with an on-screen keyboard
- Checks written music theory work via photo upload
- Supports typing and speaking for accessibility
- Motivates consistency with streaks, badges, and a friendly cow mascot

---

## 2. Goals & Success Metrics

### Product Goals
- Improve conceptual understanding of music theory
- Increase independent practice frequency
- Make music theory playful, approachable, and confidence-building

### MVP Success Metrics
- Average session length ≥ 5 minutes
- ≥ 3 sessions per week per active user
- ≥ 70% follow-up question completion rate
- ≥ 40% of users use the photo-check feature
- ≥ 50% of users try voice input at least once

---

## 3. Target Users

### Primary User
- Children ages 7–13 learning music theory
- Tablet-first users (iPad or Android)
- Limited typing ability; benefit from voice input

### Secondary Users
- Parents encouraging practice at home
- Music teachers recommending supplemental tools

---

## 4. Core Features (MVP)

---

### 4.1 AI Tutor Chat (Text + Voice Input)

**Description**  
A conversational AI tutor that answers music theory questions and checks understanding in a friendly, encouraging tone.

**User Input Methods**
- Text input (on-screen keyboard)
- Voice input (speech-to-text) via microphone button

**Functional Requirements**
- Short explanations (≤ 4 sentences)
- Age-appropriate language
- Always include 1–2 follow-up questions
- Difficulty levels: “Explain like I’m 7 / 10 / 13”
- Voice input behavior:
  - Press-and-hold or tap-to-record
  - Live transcription shown in input field
  - User must confirm before sending
  - Visual listening indicators (cow mascot "listening" state)

**Speech-to-Text Implementation**
- **iOS**: Native Speech framework (SFSpeechRecognizer)
  - No additional dependencies required
  - Supports offline recognition (limited)
  - Requires microphone permission
- **Android**: Google Speech Recognition API or @react-native-voice/voice
  - Requires internet connection for full accuracy
  - Requires microphone permission
  - Fallback to manual input if unavailable
- **Transcription Display**: 
  - Shown in input field immediately after speech ends
  - Editable before sending
  - Maximum 2 second delay for transcription display
- **Error Handling**:
  - Permission denied: Show settings link, fallback to text input
  - Recognition failed: Show "Couldn't understand. Try typing instead."
  - Network required (Android): Show "Internet needed for voice input"

**Acceptance Criteria**
- Voice input works on iOS and Android
- Transcription appears in < 2 seconds after speech ends
- Transcribed text is editable
- Tutor responses never exceed defined verbosity limits

**Chat History Management**
- Stored locally: AsyncStorage key `@moosic_buddy:chat_history`
- Format: Array of ChatMessage objects
- Persistence: Messages persist across app restarts
- Context window: Last 20 messages sent to AI (to manage token usage)
- Clear history: Option available in settings (future enhancement)
- Message structure:
  ```typescript
  {
    id: string (UUID),
    role: 'user' | 'assistant',
    content: string,
    timestamp: Date (ISO string),
    difficultyLevel?: '7' | '10' | '13'
  }
  ```

**AI Response Format**
- Structured response from `/chat` endpoint:
  ```typescript
  {
    explanation: string (≤4 sentences),
    followUpQuestions: string[] (1-2 questions),
    keyboardChallenge?: {
      type: 'note' | 'interval' | 'chord',
      description: string,
      targetNotes: string[]
    }
  }
  ```
- Response validation: Backend enforces verbosity limits
- Age-appropriate language: Enforced via prompt engineering

---

### 4.2 Text-to-Speech (TTS) Output

**Description**  
All tutor responses can be read aloud.

**Requirements**
- Tap-to-read button on each AI message
- Optional auto-read mode
- Friendly, calm voice

**Acceptance Criteria**
- TTS functions reliably on iOS and Android
- Can be disabled in settings

**TTS Implementation**
- Library: expo-speech
- Voice selection: System default (friendly, calm voice)
- Language: English (US)
- Rate: Normal speed (adjustable in future)
- Pitch: Normal (adjustable in future)
- Auto-read mode: Respects `autoReadEnabled` setting
- Manual read: Tap-to-read button on each AI message
- Error handling: Silent failure if TTS unavailable, show text-only

---

### 4.3 Interactive Keyboard

**Description**  
An on-screen piano keyboard for experimenting with notes, intervals, and chords.

**Requirements**
- 1–2 octave keyboard
- Tap to play notes
- Visual highlight on pressed keys
- Toggleable note labels
- Supports AI-generated “Try it” challenges

**Acceptance Criteria**
- Audio latency ≤ 150ms
- Correct pitch mapping
- Clear visual feedback

**Keyboard Implementation Details**
- Library: expo-av for audio playback
- Audio format: Pre-loaded WAV files for each note (C4-C6 range)
- Octave support: 1-2 octaves (configurable)
- Note mapping: Standard piano layout (A0 = 27.5Hz, C4 = 261.63Hz, etc.)
- Visual feedback:
  - Key highlight on press (color change)
  - Key release animation
  - Note label display (toggleable via settings)
- Latency optimization:
  - Pre-load audio files on component mount
  - Use Sound objects from expo-av
  - Immediate visual feedback, audio follows
- Challenge mode: AI can generate "Try it" challenges with target notes

---

### 4.4 Photo “Check My Work”

**Description**  
Students upload a photo of a worksheet problem and receive instant feedback.

**Supported Problem Types (MVP)**
- Chord spelling
- Interval identification
- Note naming
- Key signature identification

**User Flow**
1. Tap “Check My Work”
2. Take or upload photo
3. Crop to a single problem
4. AI analyzes and responds

**Requirements**
- Enforce one problem per photo
- If image clarity is insufficient, request a retake (no guessing)
- AI feedback includes:
  - Correctness
  - Specific mistakes
  - Simple explanation
  - Follow-up question
  - Optional keyboard task

**Acceptance Criteria**
- Structured JSON response
- Clear retry messaging
- Age-appropriate corrections

**Image Upload Specifications**
- Client-side compression before upload:
  - Target: < 2MB file size
  - Format: JPEG
  - Quality: 80%
  - Max dimensions: 2048x2048px
- User can crop image to single problem before upload
- Image processed server-side then discarded (no storage)
- Error handling for:
  - File too large (compress further or reject)
  - Unsupported format (convert to JPEG)
  - Network failure (retry with exponential backoff)

---

### 4.5 Progress Tracking (Streaks & Badges)

**Description**  
Light gamification to encourage consistent practice.

**Requirements**
- Daily streak counter
- Streak increases after:
  - Completing a tutor interaction, OR
  - Completing a photo-check task
- Simple badges (e.g., “3 Days in a Row”, “Chord Champion”)

**Acceptance Criteria**
- Progress stored locally on device
- Streak resets only after a missed day
- Progress-based logic versioned for future migration

**Streak Calculation Logic**
- Streak increments when:
  - User completes a tutor interaction (sends message and receives response), OR
  - User completes a photo-check task (uploads and receives feedback)
- Streak calculation:
  - First session: Streak = 1
  - Same day (within 24 hours): No increment
  - Next day (24-48 hours since last session): Increment streak
  - Missed day (>48 hours): Reset streak to 1
- Streak stored in UserProgress object with lastSessionDate timestamp
- Badge triggers:
  - 3 days: "3 Days in a Row" badge
  - 7 days: "Week Warrior" badge
  - 14 days: "Two Week Champion" badge
  - 30 days: "Monthly Master" badge

**Badge System**
- **Streak Badges**: 3, 7, 14, 30 days
- **Activity Badges**: 
  - First Question (first chat message)
  - Curious Learner (10 questions)
  - Dedicated Student (50 questions)
- **Skill Badges**:
  - Chord Champion (5 correct chord identifications)
  - Interval Expert (5 correct interval identifications)
  - Note Namer (10 correct note identifications)
- **Feature Badges**:
  - Photo Checker (first photo upload)
  - Voice User (first voice input)
- Badges stored in UserProgress.badges array
- Badge earned notifications shown with mascot celebration animation

---

### 4.6 Mascot: The Moosic Buddy Cow 🐄

**Description**  
A friendly cartoon cow that acts as the student’s learning companion.

**Requirements**
- Three emotional states:
  - Thinking (listening / analyzing)
  - Happy (correct answer)
  - Cheering (streaks / badges)
- Appears in chat, results, and progress screens

**Acceptance Criteria**
- Mascot reacts contextually to user actions
- Animations enhance engagement without distraction

---

## 5. Settings & Controls

**User-Adjustable Settings**
- Voice input on/off
- Auto-read responses on/off
- Explanation level (7 / 10 / 13)
- Note labels on/off
- Sound effects on/off

**Settings Storage**
- Stored locally in AsyncStorage: `@moosic_buddy:settings`
- Default values:
  - `autoReadEnabled: false`
  - `difficultyLevel: '10'`
  - `soundEnabled: true`
  - `noteLabelsEnabled: true`
- Settings persist across app restarts
- Settings accessible via Settings screen (location: TBD - tab or menu)

**Settings Screen Location**
- Accessible from main navigation (to be determined: dedicated tab, profile section, or hamburger menu)

---

## 6. Identity & Accounts Strategy

### MVP (No Login)
- App generates a persistent **anonymous install_id** on first launch
- install_id used for:
  - Rate limiting
  - Abuse prevention
  - Usage analytics (non-identifying)

**install_id Implementation**
- **Generation**: UUID v4 generated on first app launch
- **Storage**: Stored in AsyncStorage with key `@moosic_buddy:install_id`
- **Persistence**: Persists across app updates, resets only on full uninstall
- **API Usage**: Sent in `X-Install-ID` header with all backend requests
- **Privacy**: No correlation with device identifiers or personal information
- **Format**: Standard UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Future (Post-MVP)
- Optional user accounts (Apple / Google sign-in)
- Ability to link existing install_id progress to new account
- Cloud sync for progress, streaks, and settings
- Parent dashboard support

**Requirement**
- All local data schemas must be versioned to support migration

**Data Schema Versioning**
- Current schema version: `1.0`
- Stored with each data object: `{ version: '1.0', data: {...} }`
- Migration strategy: Check version on load, migrate if needed
- Storage keys use namespaced format: `@moosic_buddy:<key_name>`
- Supported schemas:
  - UserProgress: `{ version, streak, badges[], totalSessions, lastSessionDate }`
  - AppSettings: `{ version, autoReadEnabled, difficultyLevel, soundEnabled, noteLabelsEnabled }`
  - ChatMessage: `{ version, id, role, content, timestamp, difficultyLevel? }`

---

## 7. Scalability & Production Requirements

- Backend must be **stateless** and horizontally scalable
- All AI calls routed through backend (no client-side API keys)
- Per-install rate limits and quotas enforced
- Image compression performed client-side before upload
  - Target file size: < 2MB
  - Format: JPEG, quality 80%
  - Max dimensions: 2048x2048px
  - Library: expo-image-manipulator
  - Compression happens before FormData creation
- Tiered model usage (text vs vision) to control cost
- Graceful degradation when AI unavailable (keyboard + local practice still usable)

**Error Handling & Offline Behavior**

**Network Errors**
- Connection timeout: 30 seconds
- Retry logic: Exponential backoff (1s, 2s, 4s, 8s, max 3 retries)
- User-facing messages:
  - "Having trouble connecting. Please check your internet."
  - "Try again" button with retry functionality
- Offline mode: Keyboard remains fully functional, show banner: "Connect to internet for AI tutor"

**AI Service Errors**
- Service unavailable (503): Show friendly message, suggest retry later
- Rate limit exceeded (429): Show message with time until reset
- Invalid request (400): Log error, show generic "Something went wrong" message
- Server error (500): Show "Our tutor is having trouble. Please try again."

**Permission Errors**
- Camera denied: Show message with link to settings
- Microphone denied: Show message with link to settings, fallback to text input
- Photo library denied: Show message with link to settings

**Image Upload Errors**
- File too large: Automatically compress further or show error
- Invalid format: Convert to JPEG automatically
- Upload failure: Show retry button, preserve image in memory

**Local Storage Errors**
- Storage full: Show warning, suggest clearing cache
- Corrupted data: Reset to defaults, log error

---

## 8. Technical Architecture

### Frontend
- **Framework**: React Native with Expo (~51.0.0)
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript with strict mode
- **State Management**: React hooks (useState, useEffect)
- **Storage**: AsyncStorage for local persistence
- **Camera & Image**: expo-camera, expo-image-picker, expo-image-manipulator
- **Speech-to-Text**: 
  - iOS: Native Speech framework (built-in, no additional library)
  - Android: Google Speech Recognition API or @react-native-voice/voice
  - Fallback: Manual text input if permission denied
- **Text-to-Speech**: expo-speech
- **Audio Playback**: expo-av (for keyboard notes)
- **UI Components**: React Native core + @expo/vector-icons

### Backend
- Minimal API service
- Responsibilities:
  - AI calls (text + vision)
  - Prompt enforcement
  - Rate limiting and quotas
  - Safety filtering
  - Request validation

### API Endpoints

#### POST /chat - AI Tutor Chat Endpoint

**Request Headers**
- `Content-Type: application/json`
- `X-Install-ID: <uuid>` - Anonymous install identifier (required)

**Request Body**
```json
{
  "message": "string",
  "difficultyLevel": "7" | "10" | "13",
  "conversationHistory": [
    { "role": "user" | "assistant", "content": "string" }
  ],
  "maxSentences": 4,
  "requireFollowUp": true
}
```

**Response Body**
```json
{
  "explanation": "string (≤4 sentences)",
  "followUpQuestions": ["string", "string"],
  "keyboardChallenge": {
    "type": "note" | "interval" | "chord",
    "description": "string",
    "targetNotes": ["string"]
  } // optional
}
```

**Error Responses**
- `400 Bad Request`: Invalid request format
- `429 Too Many Requests`: Rate limit exceeded (includes `Retry-After` header)
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: AI service unavailable

#### POST /check-work - Photo Worksheet Analysis Endpoint

**Request Headers**
- `Content-Type: multipart/form-data`
- `X-Install-ID: <uuid>` - Anonymous install identifier (required)

**Request Body (FormData)**
- `image`: File (JPEG, < 2MB, max 2048x2048px)
- `problemType`: "chord" | "interval" | "note" | "key-signature"

**Response Body**
```json
{
  "isCorrect": boolean,
  "mistakes": ["string"], // optional, present if not correct
  "explanation": "string",
  "followUpQuestion": "string",
  "keyboardChallenge": {
    "type": "note" | "interval" | "chord",
    "description": "string",
    "targetNotes": ["string"]
  }, // optional
  "needsRetake": boolean, // optional
  "retakeReason": "string" // optional, present if needsRetake is true
}
```

**Error Responses**
- `400 Bad Request`: Invalid image or problem type
- `413 Payload Too Large`: Image exceeds size limit
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: AI service unavailable

**Rate Limiting**
- Text chat: 50 requests/hour per install_id
- Photo check: 20 requests/hour per install_id
- Daily cap: 200 total requests per install_id
- Response: `429 Too Many Requests` with `Retry-After` header when limit exceeded
- User-facing message: "You've asked lots of questions today! Take a break and come back tomorrow."

---

## 9. Privacy & Safety

- No personal data collection in MVP
- No image storage (processed then discarded)
- No audio storage
- Anonymous install_id only
- Privacy policy required for app stores
- Kid-safe prompt and response constraints enforced

---

## 10. Accessibility

**Requirements**
- Full VoiceOver/TalkBack support for all interactive elements
- High contrast mode option (future enhancement)
- Adjustable font sizes (3 levels: default, large, extra large)
- Voice input as primary accessibility feature (reduces typing burden)
- Clear visual feedback for all interactions
- Color-blind friendly palette (avoid red/green only indicators)
- Keyboard navigation support (for tablet/web interfaces)
- All images and icons have accessible labels
- Focus indicators clearly visible

**Implementation Details**
- All buttons and interactive elements have `accessibilityLabel` props
- Screen reader announcements for:
  - AI responses
  - Streak updates
  - Badge achievements
  - Error messages
- Voice input button prominently displayed and easily accessible
- TTS (text-to-speech) serves as primary accessibility feature
- Keyboard shortcuts where applicable (web/tablet)

**Acceptance Criteria**
- App passes WCAG 2.1 AA standards
- Tested with VoiceOver on iOS (iPad/iPhone)
- Tested with TalkBack on Android
- All interactive elements have accessible labels
- Screen reader users can complete all core flows independently
- Voice input works reliably as alternative to typing
