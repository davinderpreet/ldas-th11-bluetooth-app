// src/components/VolumeControl.js
// Premium Volume Control Component

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import SystemSetting from 'react-native-system-setting';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Button from './Button';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius } from '../styles/spacing';

const VolumeControl = ({ theme = 'dark' }) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(50);

  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  // Get current system volume on mount
  useEffect(() => {
    getCurrentVolume();
    
    // Listen to volume changes
    const volumeListener = SystemSetting.addVolumeListener((data) => {
      const volPercent = Math.round(data.value * 100);
      setVolume(volPercent);
    });

    return () => {
      SystemSetting.removeVolumeListener(volumeListener);
    };
  }, []);

  const getCurrentVolume = async () => {
    try {
      const vol = await SystemSetting.getVolume();
      setVolume(Math.round(vol * 100));
    } catch (error) {
      console.error('Error getting volume:', error);
    }
  };

  const setSystemVolume = async (newVolume) => {
    try {
      await SystemSetting.setVolume(newVolume / 100);
      setVolume(newVolume);
      
      // Haptic feedback
      ReactNativeHapticFeedback.trigger('impactLight');
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const increaseVolume = () => {
    const newVolume = Math.min(100, volume + 10);
    setSystemVolume(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(0, volume - 10);
    setSystemVolume(newVolume);
  };

  const toggleMute = async () => {
    if (isMuted) {
      // Unmute
      await setSystemVolume(previousVolume);
      setIsMuted(false);
    } else {
      // Mute
      setPreviousVolume(volume);
      await setSystemVolume(0);
      setIsMuted(true);
    }
  };

  const setPreset = (preset) => {
    let newVolume;
    switch (preset) {
      case 'quiet':
        newVolume = 25;
        break;
      case 'normal':
        newVolume = 50;
        break;
      case 'loud':
        newVolume = 75;
        break;
      case 'max':
        newVolume = 100;
        break;
      default:
        newVolume = 50;
    }
    setSystemVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

  return (
    <View style={styles.container}>
      {/* Volume Display */}
      <View style={styles.displayContainer}>
        <Text style={[styles.icon, { color: themeColors.text }]}>
          {getVolumeIcon()}
        </Text>
        <Text style={[styles.percentage, { color: colors.primary }]}>
          {volume}%
        </Text>
      </View>

      {/* Volume Bar */}
      <View style={[styles.volumeBar, { backgroundColor: themeColors.border }]}>
        <View
          style={[
            styles.volumeBarFill,
            {
              width: `${volume}%`,
              backgroundColor: isMuted ? colors.disconnected : colors.primary,
            },
          ]}
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <View style={styles.mainControls}>
          <Button
            title="−"
            onPress={decreaseVolume}
            variant="secondary"
            size="huge"
            style={styles.controlButton}
            theme={theme}
          />
          
          <Button
            title={isMuted ? "UNMUTE" : "MUTE"}
            onPress={toggleMute}
            variant={isMuted ? "danger" : "primary"}
            size="huge"
            style={styles.muteButton}
            theme={theme}
          />
          
          <Button
            title="+"
            onPress={increaseVolume}
            variant="secondary"
            size="huge"
            style={styles.controlButton}
            theme={theme}
          />
        </View>

        {/* Presets */}
        <View style={styles.presets}>
          <Text style={[styles.presetsLabel, { color: themeColors.textSecondary }]}>
            QUICK PRESETS
          </Text>
          <View style={styles.presetButtons}>
            <Button
              title="25%"
              onPress={() => setPreset('quiet')}
              variant="ghost"
              size="small"
              style={styles.presetButton}
              theme={theme}
            />
            <Button
              title="50%"
              onPress={() => setPreset('normal')}
              variant="ghost"
              size="small"
              style={styles.presetButton}
              theme={theme}
            />
            <Button
              title="75%"
              onPress={() => setPreset('loud')}
              variant="ghost"
              size="small"
              style={styles.presetButton}
              theme={theme}
            />
            <Button
              title="100%"
              onPress={() => setPreset('max')}
              variant="ghost"
              size="small"
              style={styles.presetButton}
              theme={theme}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  percentage: {
    ...typography.numberLarge,
  },
  volumeBar: {
    height: 12,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  volumeBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  controls: {
    width: '100%',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  muteButton: {
    flex: 2,
    marginHorizontal: spacing.xs,
  },
  presets: {
    alignItems: 'center',
  },
  presetsLabel: {
    ...typography.labelSmall,
    marginBottom: spacing.sm,
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  presetButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});

export default VolumeControl;