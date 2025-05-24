import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

export const Container = ({ children, style, elevation = 2 }) => {
  // Platform-specific shadow styles
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: elevation,
    },
    default: {
      // Web or other platforms
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
  });

  return (
    <View style={[styles.container, shadowStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

export default Container;