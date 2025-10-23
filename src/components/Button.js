// src/components/Button.js
// Premium Button Component - Industry Leading

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, touchTargets, shadows } from '../styles/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'large',      // small, medium, large, huge
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  gradient = false,
  style,
  textStyle,
  theme = 'dark',
}) => {
  
  const handlePress = () => {
    if (disabled || loading) return;
    
    // Haptic feedback
    const hapticOptions = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    
    onPress && onPress();
  };

  const getButtonStyles = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (fullWidth) baseStyle.push(styles.fullWidth);
    if (disabled) baseStyle.push(styles.disabled);
    
    return baseStyle;
  };

  const getTextStyles = () => {
    return [
      size === 'huge' ? typography.buttonLarge : 
      size === 'large' ? typography.button :
      size === 'medium' ? typography.button :
      typography.buttonSmall,
      styles[`${variant}Text`],
      disabled && styles.disabledText,
      textStyle,
    ];
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size={size === 'small' ? 'small' : 'large'}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={getTextStyles()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </>
  );

  // Gradient button
  if (gradient && !disabled && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[getButtonStyles(), style]}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Standard button
  return (
    <TouchableOpacity
      style={[getButtonStyles(), styles[variant], style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.light.md,
  },
  
  // Sizes
  small: {
    height: touchTargets.standard,
    paddingHorizontal: spacing.md,
  },
  medium: {
    height: touchTargets.comfortable,
    paddingHorizontal: spacing.lg,
  },
  large: {
    height: touchTargets.large,
    paddingHorizontal: spacing.xl,
  },
  huge: {
    height: touchTargets.huge,
    paddingHorizontal: spacing.xxl,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.dark.surfaceElevated,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    ...shadows.light.none,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  success: {
    backgroundColor: colors.success,
  },
  
  // Text styles
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.dark.text,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.white,
  },
  successText: {
    color: colors.white,
  },
  
  // States
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
    ...shadows.light.none,
  },
  disabledText: {
    opacity: 0.6,
  },
  
  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  
  // Gradient
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;