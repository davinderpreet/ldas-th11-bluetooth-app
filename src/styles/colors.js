// src/styles/colors.js
// LDAS Brand Colors - Premium Blue Palette

export const colors = {
  // Primary Brand Colors (from Canva brand kit)
  primary: '#0E3cff',        // Electric Blue - Main brand color
  primaryDark: '#053204',    // Deep Blue
  primaryDeep: '#0428aa',    // Royal Blue
  primaryDarker: '#031e80',  // Navy Blue
  primaryDarkest: '#021455', // Midnight Blue
  brandBlack: '#04042b',     // Premium Black
  
  // Accent Colors
  accent: '#00D9FF',         // Cyan - for highlights
  accentGreen: '#00FF88',    // Neon Green - success states
  accentPurple: '#8B5CF6',   // Purple - premium features
  
  // Status Colors
  success: '#10B981',        // Green
  warning: '#F59E0B',        // Amber
  danger: '#EF4444',         // Red
  info: '#3B82F6',           // Blue
  
  // Light Theme
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Dark Theme (Premium)
  dark: {
    background: '#04042b',     // Brand black
    backgroundSecondary: '#0A0A1F',
    surface: '#021455',        // Midnight blue
    surfaceElevated: '#031e80', // Navy blue
    text: '#FFFFFF',
    textSecondary: '#A0AEC0',
    textTertiary: '#718096',
    border: '#1E293B',
    borderLight: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Gradients
  gradients: {
    primary: ['#0E3cff', '#0428aa'],
    success: ['#10B981', '#059669'],
    premium: ['#8B5CF6', '#6366F1'],
    dark: ['#04042b', '#021455'],
  },
  
  // Connection States
  connected: '#10B981',
  connecting: '#3B82F6',
  disconnected: '#6B7280',
  error: '#EF4444',
  
  // Battery States
  batteryHigh: '#10B981',
  batteryMedium: '#F59E0B',
  batteryLow: '#EF4444',
  charging: '#3B82F6',
  
  // Transparent overlays
  overlay10: 'rgba(14, 60, 255, 0.1)',
  overlay20: 'rgba(14, 60, 255, 0.2)',
  overlay30: 'rgba(14, 60, 255, 0.3)',
  
  // White with opacity
  white: '#FFFFFF',
  white90: 'rgba(255, 255, 255, 0.9)',
  white80: 'rgba(255, 255, 255, 0.8)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white40: 'rgba(255, 255, 255, 0.4)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white10: 'rgba(255, 255, 255, 0.1)',
  
  // Black with opacity
  black: '#000000',
  black90: 'rgba(0, 0, 0, 0.9)',
  black80: 'rgba(0, 0, 0, 0.8)',
  black60: 'rgba(0, 0, 0, 0.6)',
  black40: 'rgba(0, 0, 0, 0.4)',
  black20: 'rgba(0, 0, 0, 0.2)',
  black10: 'rgba(0, 0, 0, 0.1)',
};

export default colors;