// src/styles/theme.js
// LDAS Theme System with Dark/Light Mode

import { colors } from './colors';

export const getTheme = (isDark) => {
  const baseColors = isDark ? colors.dark : colors.light;
  
  return {
    // Base colors
    ...baseColors,
    
    // Brand colors (same in both themes)
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryDeep: colors.primaryDeep,
    accent: colors.accent,
    accentGreen: colors.accentGreen,
    accentPurple: colors.accentPurple,
    
    // Status colors
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    
    // Connection states
    connected: colors.connected,
    connecting: colors.connecting,
    disconnected: colors.disconnected,
    error: colors.error,
    
    // Battery states
    batteryHigh: colors.batteryHigh,
    batteryMedium: colors.batteryMedium,
    batteryLow: colors.batteryLow,
    charging: colors.charging,
    
    // Gradients
    gradients: colors.gradients,
    
    // Mode-specific properties
    isDark,
    statusBarStyle: isDark ? 'light-content' : 'dark-content',
    
    // Card styles
    card: {
      backgroundColor: baseColors.surface,
      borderColor: baseColors.border,
    },
    
    // Button styles
    button: {
      primary: {
        background: colors.primary,
        text: colors.white,
      },
      secondary: {
        background: baseColors.surfaceElevated,
        text: baseColors.text,
      },
      ghost: {
        background: 'transparent',
        text: colors.primary,
      },
      danger: {
        background: colors.danger,
        text: colors.white,
      },
    },
    
    // Input styles
    input: {
      background: baseColors.surface,
      border: baseColors.border,
      text: baseColors.text,
      placeholder: baseColors.textTertiary,
    },
    
    // Overlay
    overlay: baseColors.overlay,
  };
};

// Pre-defined themes
export const lightTheme = getTheme(false);
export const darkTheme = getTheme(true);

export default {
  light: lightTheme,
  dark: darkTheme,
  getTheme,
};