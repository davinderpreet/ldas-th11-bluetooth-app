// src/styles/typography.js
// LDAS Typography System - Modern & Professional

import { StyleSheet, Platform } from 'react-native';

export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
  black: Platform.select({
    ios: 'System',
    android: 'Roboto-Black',
  }),
};

export const typography = StyleSheet.create({
  // Display Styles (Hero Text)
  displayLarge: {
    fontFamily: fontFamily.black,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 56,
  },
  displayMedium: {
    fontFamily: fontFamily.black,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 48,
  },
  displaySmall: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  
  // Headings
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 28,
  },
  h4: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 26,
  },
  
  // Body Text
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
  },
  
  // Labels
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  
  // Buttons
  buttonLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  buttonSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  
  // Caption
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
  },
  captionBold: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 16,
  },
  
  // Overline (Small labels above content)
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  
  // Numbers (for battery, volume, etc)
  numberHuge: {
    fontFamily: fontFamily.black,
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 72,
  },
  numberLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 56,
  },
  number: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  
  // Link
  link: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
});

// Text weights for dynamic use
export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

export default typography;