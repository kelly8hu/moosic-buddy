# Setup Instructions

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if it exists)
   - Add your AI API URL: `EXPO_PUBLIC_AI_API_URL=your_api_url_here`

3. **Install Expo CLI globally (if not already installed):**
   ```bash
   npm install -g expo-cli
   ```

## Running the App

### Development Server
```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS simulator (Mac only)
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your physical device

### Platform-Specific Commands
```bash
npm run ios      # Start and open iOS simulator
npm run android  # Start and open Android emulator
npm run web      # Start web version
```

## Required Assets

Before building, you'll need to add these assets to the `assets/` folder:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436 recommended)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

You can generate these using tools like:
- [Expo Asset Generator](https://www.npmjs.com/package/@expo/asset-generator)
- [App Icon Generator](https://www.appicon.co/)

## Voice Input Setup

For voice input (speech-to-text), you'll need to:

1. **iOS**: Uses native `Speech` framework - no additional setup needed
2. **Android**: May require additional permissions or a speech recognition library

Consider using:
- `expo-speech` for text-to-speech (already included)
- Native speech recognition APIs or a library like `@react-native-voice/voice`

## AI Service Integration

The app is set up to integrate with an AI service. Update `src/services/aiService.ts` with your actual API endpoints.

Example services you can use:
- OpenAI GPT-4
- Anthropic Claude
- Custom backend API

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Note: You'll need to set up an Expo account and configure EAS (Expo Application Services) for production builds.

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues:**
   ```bash
   npm start -- --clear
   ```

2. **TypeScript errors:**
   ```bash
   npm run type-check
   ```

3. **Missing dependencies:**
   ```bash
   npm install
   ```

4. **iOS simulator not opening:**
   - Make sure Xcode is installed
   - Run `xcode-select --install` if needed

5. **Android emulator not opening:**
   - Make sure Android Studio is installed
   - Create an Android Virtual Device (AVD) in Android Studio

