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
- Supports both typing and speaking for accessibility
- Motivates consistency through streaks, badges, and a friendly cow mascot

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
  - Visual listening indicators (cow mascot “listening” state)

**Acceptance Criteria**
- Voice input works on iOS and Android
- Transcription appears in < 2 seconds after speech ends
- Transcribed text is editable
- Tutor responses never exceed defined verbosity limits

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

---

### 4.5 Progress Tracking (Streaks & Badges)

**Description**  
Light gamification to encourage consistent practice.

**Requirements**
- Daily streak counter
- Streak increases after:
  - Completing a tutor interaction, OR
  - Completing a
