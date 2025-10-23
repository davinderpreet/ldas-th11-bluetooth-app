// src/components/Card.js
// Premium Card Component with Glass Morphism

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../styles/colors';
import { spacing, borderRadius, shadows } from '../styles/spacing';

const Card = ({
  children,
  variant = 'elevated', // elevated, flat, outlined, glass
  theme = 'dark',
  gradient = false,
  style,
  padding = 'lg',
}) => {
  
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return spacing.sm;
      case 'md': return spacing.md;
      case 'lg': return spacing.lg;
      case 'xl': return spacing.xl;
      default: return spacing.lg;
    }
  };

  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  if (gradient) {
    return (
      <View style={[styles.card, styles[variant], style]}>
        <LinearGradient
          colors={[colors.primaryDarkest, colors.primaryDarker]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCard, { padding: getPadding() }]}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        styles[variant],
        {
          backgroundColor: variant === 'glass' 
            ? colors.white10 
            : themeColors.surface,
          borderColor: themeColors.border,
          padding: getPadding(),
        },
        variant === 'elevated' && (theme === 'dark' ? shadows.dark.lg : shadows.light.lg),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  
  elevated: {
    // Shadow added dynamically based on theme
  },
  
  flat: {
    shadowOpacity: 0,
    elevation: 0,
  },
  
  outlined: {
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  glass: {
    borderWidth: 1,
    borderColor: colors.white20,
    backdropFilter: 'blur(10px)',
  },
  
  gradientCard: {
    borderRadius: borderRadius.lg,
  },
});

export default Card;