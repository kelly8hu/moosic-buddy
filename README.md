# Moosic Buddy 🐄

An interactive AI-powered music theory tutor for kids ages 7-13.

## Features

- **AI Tutor Chat**: Conversational music theory tutor with text and voice input
- **Interactive Keyboard**: On-screen piano keyboard for hands-on learning
- **Photo Check**: Upload photos of worksheets for instant feedback
- **Progress Tracking**: Streaks and badges to encourage consistent practice

## Tech Stack

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Expo AV** for audio playback
- **Expo Camera** for photo capture
- **Expo Speech** for text-to-speech
- **AsyncStorage** for local data persistence

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

### Project Structure

```
moosic-buddy/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-specific code
│   │   ├── chat/         # Chat feature
│   │   └── keyboard/     # Keyboard feature
│   ├── services/          # API and storage services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and constants
├── assets/               # Images, fonts, etc.
└── package.json
```

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```
EXPO_PUBLIC_AI_API_URL=your_ai_api_url_here
```

## Next Steps

1. Set up AI service integration (OpenAI, Anthropic, etc.)
2. Implement voice input with speech-to-text
3. Build interactive piano keyboard component
4. Add photo upload and analysis
5. Implement progress tracking and badges
6. Add settings screen
7. Create mascot animations

## License

Private project - All rights reserved
