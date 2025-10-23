// src/screens/HomeScreen.js
// LDAS Premium Home Screen - Industry Leading UI

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';
import Card from '../components/Card';
import BatteryIndicator from '../components/BatteryIndicator';
import VolumeControl from '../components/VolumeControl';
import { useBluetooth } from '../hooks/useBluetooth';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

const HomeScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  
  const {
    devices,
    connectedDevice,
    isScanning,
    isConnecting,
    batteryLevel,
    signalStrength,
    signalLabel,
    isConnected,
    startScan,
    connect,
    disconnect,
    checkBluetoothStatus,
  } = useBluetooth();

  const theme = isDarkMode ? 'dark' : 'light';
  const themeColors = isDarkMode ? colors.dark : colors.light;

  useEffect(() => {
    checkBluetoothStatus();
  }, []);

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect
      const success = await disconnect();
      if (success) {
        Alert.alert('Disconnected', 'Device has been disconnected');
      }
    } else {
      // Start scanning for devices
      await startScan();
    }
  };

  const handleDeviceSelect = async (device) => {
    const result = await connect(device);
    if (result.success) {
      Alert.alert('Connected!', `Connected to ${device.name}`);
      setShowVolume(true);
    } else {
      Alert.alert('Connection Failed', result.error || 'Could not connect to device');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.background}
      />
      
      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? colors.gradients.dark : ['#FFFFFF', '#F9FAFB']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.logo, { color: colors.primary }]}>LDAS</Text>
              <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
                Long Distance Audio System
              </Text>
            </View>
            
            <View style={styles.headerRight}>
              {/* Theme Toggle */}
              <TouchableOpacity
                style={styles.themeToggle}
                onPress={toggleTheme}
              >
                <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
              
              {/* Battery */}
              {batteryLevel !== null && (
                <View style={styles.headerBattery}>
                  <Text style={[styles.batteryText, { color: themeColors.text }]}>
                    🔋 {batteryLevel}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status Card */}
        <Card variant="elevated" theme={theme} gradient={isConnected}>
          <View style={styles.statusCard}>
            {/* Status Indicator */}
            <View style={styles.statusHeader}>
              <View style={styles.statusDot}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isConnected
                        ? colors.connected
                        : isScanning
                        ? colors.connecting
                        : colors.disconnected,
                    },
                  ]}
                />
                {isConnected && (
                  <View style={styles.pulse} />
                )}
              </View>
              
              <View style={styles.statusText}>
                <Text style={[styles.statusTitle, { color: colors.white }]}>
                  {isConnected
                    ? connectedDevice?.name || 'Connected'
                    : isScanning
                    ? 'Scanning...'
                    : 'Disconnected'}
                </Text>
                {isConnected && signalStrength !== null && (
                  <Text style={[styles.statusSubtitle, { color: colors.white80 }]}>
                    {signalLabel} Signal • {signalStrength}%
                  </Text>
                )}
              </View>
            </View>

            {/* Connection Button */}
            <Button
              title={
                isConnected
                  ? 'DISCONNECT'
                  : isScanning
                  ? 'SCANNING...'
                  : 'SCAN FOR DEVICES'
              }
              onPress={handleConnect}
              variant={isConnected ? 'danger' : 'primary'}
              size="huge"
              loading={isScanning || isConnecting}
              fullWidth
              gradient={!isConnected}
              style={styles.connectionButton}
            />
          </View>
        </Card>

        {/* Available Devices */}
        {isScanning && devices.length > 0 && (
          <Card variant="elevated" theme={theme} style={styles.devicesCard}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Available Devices
            </Text>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceItem,
                  { backgroundColor: themeColors.surfaceElevated },
                ]}
                onPress={() => handleDeviceSelect(device)}
              >
                <Text style={[styles.deviceName, { color: themeColors.text }]}>
                  📱 {device.name}
                </Text>
                <Text style={[styles.deviceId, { color: themeColors.textSecondary }]}>
                  {device.id.substring(0, 17)}...
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Battery & Controls */}
        {isConnected && (
          <>
            {/* Battery Card */}
            <Card variant="elevated" theme={theme}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Battery Status
              </Text>
              <View style={styles.batteryContainer}>
                <BatteryIndicator
                  level={batteryLevel || 85}
                  size={140}
                  charging={false}
                  theme={theme}
                />
                <View style={styles.batteryInfo}>
                  <Text style={[styles.batteryLabel, { color: themeColors.textSecondary }]}>
                    Estimated Time
                  </Text>
                  <Text style={[styles.batteryTime, { color: themeColors.text }]}>
                    {Math.floor((batteryLevel || 85) / 12)} hours
                  </Text>
                </View>
              </View>
            </Card>

            {/* Volume Control Card */}
            <Card variant="elevated" theme={theme}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Volume Control
              </Text>
              <VolumeControl theme={theme} />
            </Card>

            {/* Quick Actions */}
            <Card variant="elevated" theme={theme}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Quick Actions
              </Text>
              <View style={styles.quickActions}>
                <Button
                  title="Battery History"
                  onPress={() => Alert.alert('Coming Soon', 'Battery history feature')}
                  variant="outline"
                  size="large"
                  fullWidth
                  style={styles.actionButton}
                  theme={theme}
                />
                <Button
                  title="Device Settings"
                  onPress={() => Alert.alert('Coming Soon', 'Device settings feature')}
                  variant="outline"
                  size="large"
                  fullWidth
                  theme={theme}
                />
              </View>
            </Card>
          </>
        )}

        {/* Getting Started */}
        {!isConnected && !isScanning && (
          <Card variant="flat" theme={theme}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Getting Started
            </Text>
            <View style={styles.instructions}>
              <Text style={[styles.instructionText, { color: themeColors.textSecondary }]}>
                1. Make sure your headset is powered on
              </Text>
              <Text style={[styles.instructionText, { color: themeColors.textSecondary }]}>
                2. Tap "SCAN FOR DEVICES" above
              </Text>
              <Text style={[styles.instructionText, { color: themeColors.textSecondary }]}>
                3. Select your device from the list
              </Text>
              <Text style={[styles.instructionText, { color: themeColors.textSecondary }]}>
                4. Control volume and monitor battery
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  logo: {
    ...typography.displayMedium,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tagline: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  themeIcon: {
    fontSize: 24,
  },
  headerBattery: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white10,
    borderRadius: 20,
  },
  batteryText: {
    ...typography.labelSmall,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  statusCard: {
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  statusDot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.connected,
    opacity: 0.3,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    ...typography.h2,
  },
  statusSubtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  connectionButton: {
    marginTop: spacing.md,
  },
  devicesCard: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  deviceItem: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  deviceName: {
    ...typography.body,
    fontWeight: '600',
  },
  deviceId: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  batteryContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  batteryInfo: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  batteryLabel: {
    ...typography.labelSmall,
  },
  batteryTime: {
    ...typography.h2,
    marginTop: spacing.xs,
  },
  quickActions: {
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  instructions: {
    gap: spacing.sm,
  },
  instructionText: {
    ...typography.body,
    lineHeight: 24,
  },
});

export default HomeScreen;