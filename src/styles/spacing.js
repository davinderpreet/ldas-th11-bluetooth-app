// src/styles/spacing.js
// LDAS Spacing & Layout System

// Base unit: 4px (industry standard)
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 96,
};

// Border radius system
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999, // Fully rounded (pills)
};

// Shadow depths (elevation levels)
export const shadows = {
  // Light theme shadows
  light: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  // Dark theme shadows (more prominent)
  dark: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Touch target sizes (accessibility)
export const touchTargets = {
  min: 44,      // Minimum touch target (iOS guideline)
  standard: 48, // Standard button height
  comfortable: 56, // Comfortable for gloves
  large: 64,    // Extra large for primary actions
  huge: 72,     // Maximum size for hero buttons
};

// Container widths
export const containerWidth = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Icon sizes
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
  huge: 64,
};

// Border widths
export const borderWidth = {
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
  extraThick: 4,
};

// Opacity levels
export const opacity = {
  disabled: 0.4,
  subtle: 0.6,
  medium: 0.8,
  full: 1,
};

// Z-index layers
export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  notification: 800,
  max: 999,
};

// Animation durations (milliseconds)
export const duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

// Common layout patterns
export const layout = {
  // Screen padding
  screenPadding: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  
  // Card padding
  cardPadding: {
    padding: spacing.lg,
  },
  
  // Section spacing
  sectionSpacing: {
    marginBottom: spacing.xl,
  },
  
  // Centered content
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Column layout
  column: {
    flexDirection: 'column',
  },
  
  // Space between items
  spaceBetween: {
    justifyContent: 'space-between',
  },
};

export default {
  spacing,
  borderRadius,
  shadows,
  touchTargets,
  iconSize,
  borderWidth,
  opacity,
  zIndex,
  duration,
  layout,
};