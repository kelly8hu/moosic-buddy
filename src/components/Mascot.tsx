import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MASCOT_EMOJI } from '../utils/constants';

interface MascotProps {
  size?: number;
  animated?: boolean;
  listening?: boolean;
}

export function Mascot({ size = 80, animated = false, listening = false }: MascotProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.emoji, { fontSize: size }]}>
        {MASCOT_EMOJI}
      </Text>
      {listening && (
        <View style={styles.listeningIndicator}>
          <Text style={styles.listeningText}>Listening...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  listeningIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
  },
  listeningText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

