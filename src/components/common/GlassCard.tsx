import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'normal' | 'highlight' | 'subtle';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'normal',
}) => {
  const isHighlight = variant === 'highlight';
  const isSubtle = variant === 'subtle';

  return (
    <View
      style={[
        styles.card,
        isHighlight && styles.highlight,
        isSubtle && styles.subtle,
        Platform.OS === 'web' && (styles.webBlur as any),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  highlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  subtle: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  webBlur: {
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      } as any,
      default: {},
    }),
  },
});
