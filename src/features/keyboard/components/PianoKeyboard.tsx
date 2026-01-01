import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface PianoKeyboardProps {
  octaves?: number;
  showLabels?: boolean;
  onNotePress?: (note: string, frequency: number) => void;
}

export function PianoKeyboard({ 
  octaves = 2, 
  showLabels = true,
  onNotePress 
}: PianoKeyboardProps) {
  // TODO: Implement full keyboard with white and black keys
  // This is a placeholder structure
  
  const handleKeyPress = (note: string, frequency: number) => {
    onNotePress?.(note, frequency);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        Piano Keyboard Component
      </Text>
      <Text style={styles.subtitle}>
        {octaves} octave(s) • Labels: {showLabels ? 'On' : 'Off'}
      </Text>
      {/* Keyboard implementation will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholder: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#C7C7CC',
  },
});

