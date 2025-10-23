// src/components/BatteryIndicator.js
// Premium Battery Indicator with Circular Progress

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

const BatteryIndicator = ({ 
  level = 0, 
  size = 120, 
  charging = false,
  theme = 'dark',
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (level / 100) * circumference;

  // Get battery color based on level
  const getBatteryColor = () => {
    if (charging) return colors.charging;
    if (level >= 60) return colors.batteryHigh;
    if (level >= 30) return colors.batteryMedium;
    return colors.batteryLow;
  };

  const batteryColor = getBatteryColor();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={themeColors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={batteryColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Battery percentage */}
      <View style={styles.textContainer}>
        <Text style={[styles.percentage, { color: batteryColor }]}>
          {level}%
        </Text>
        {charging && (
          <Text style={[styles.status, { color: themeColors.textSecondary }]}>
            ⚡ Charging
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    ...typography.numberLarge,
    marginBottom: spacing.xs,
  },
  status: {
    ...typography.caption,
  },
});

export default BatteryIndicator;