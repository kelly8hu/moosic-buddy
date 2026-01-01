# Project Structure

```
moosic-buddy/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── index.tsx            # Chat screen (home)
│   │   ├── keyboard.tsx         # Interactive keyboard screen
│   │   ├── check-work.tsx       # Photo check screen
│   │   └── progress.tsx         # Progress tracking screen
│   └── _layout.tsx              # Root layout with SafeAreaProvider
│
├── src/
│   ├── components/              # Reusable UI components
│   │   └── Mascot.tsx          # Cow mascot component
│   │
│   ├── features/                # Feature-specific code
│   │   ├── chat/
│   │   │   └── components/
│   │   │       └── ChatInput.tsx    # Chat input with voice button
│   │   └── keyboard/
│   │       └── components/
│   │           └── PianoKeyboard.tsx # Piano keyboard component
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useProgress.ts      # Progress tracking hook
│   │   └── useSettings.ts      # App settings hook
│   │
│   ├── services/                # API and storage services
│   │   ├── aiService.ts         # AI tutor API integration
│   │   └── storageService.ts   # AsyncStorage wrapper
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts            # All type definitions
│   │
│   └── utils/                   # Utility functions
│       └── constants.ts        # App constants and colors
│
├── assets/                      # Images, fonts, etc.
│   └── .gitkeep
│
├── Configuration Files:
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── app.json                # Expo app configuration
│   ├── babel.config.js         # Babel configuration
│   ├── metro.config.js         # Metro bundler config
│   ├── .eslintrc.js            # ESLint configuration
│   └── .gitignore              # Git ignore rules
│
└── Documentation:
    ├── README.md               # Main project documentation
    ├── SETUP.md                # Setup instructions
    ├── PROJECT_STRUCTURE.md    # This file
    └── prd.md                  # Product Requirements Document
```

## Key Features Implemented

### ✅ Project Setup
- React Native with Expo
- TypeScript configuration
- Expo Router for navigation
- Tab-based navigation structure
- ESLint and type checking setup

### ✅ Core Architecture
- Feature-based folder structure
- Service layer for API and storage
- Custom hooks for state management
- Type definitions for type safety
- Reusable component library

### ✅ Navigation
- Tab navigation with 4 main screens:
  1. Chat (AI Tutor)
  2. Keyboard (Interactive Piano)
  3. Check Work (Photo Upload)
  4. Progress (Streaks & Badges)

### ✅ Services
- `AIService`: Placeholder for AI API integration
- `StorageService`: AsyncStorage wrapper for persistence

### ✅ Hooks
- `useProgress`: Manages user progress, streaks, and badges
- `useSettings`: Manages app settings and preferences

## Next Steps for Implementation

1. **AI Integration**
   - Connect to OpenAI/Anthropic API
   - Implement conversation history
   - Add difficulty level handling

2. **Voice Input**
   - Implement speech-to-text
   - Add voice recording UI
   - Handle transcription display

3. **Text-to-Speech**
   - Implement TTS for AI responses
   - Add play/pause controls
   - Auto-read mode toggle

4. **Interactive Keyboard**
   - Build piano keyboard component
   - Implement note playback
   - Add visual feedback
   - Support multiple octaves

5. **Photo Check**
   - Camera integration
   - Image cropping
   - AI image analysis
   - Feedback display

6. **Progress Tracking**
   - Streak calculation logic
   - Badge system
   - Progress visualization
   - Achievement notifications

7. **UI/UX**
   - Design system implementation
   - Mascot animations
   - Loading states
   - Error handling
   - Accessibility features

## Dependencies Overview

### Core
- `expo`: Expo SDK
- `expo-router`: File-based routing
- `react-native`: React Native framework
- `typescript`: Type safety

### Features
- `expo-av`: Audio playback for keyboard
- `expo-camera`: Camera access
- `expo-image-picker`: Photo selection
- `expo-speech`: Text-to-speech
- `@react-native-async-storage/async-storage`: Local storage

### UI/Navigation
- `react-native-safe-area-context`: Safe area handling
- `react-native-gesture-handler`: Gesture support
- `react-native-reanimated`: Animations
- `@expo/vector-icons`: Icon library

