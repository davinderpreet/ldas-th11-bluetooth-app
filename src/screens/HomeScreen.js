// src/screens/HomeScreen.js
// LDAS Home Screen - Classic Bluetooth (Paired Devices)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';
import Card from '../components/Card';
import VolumeControl from '../components/VolumeControl';
import { useClassicBluetooth } from '../hooks/useClassicBluetooth';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

const HomeScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    pairedDevices,
    connectedDevice,
    isLoading,
    isConnecting,
    isConnected,
    hasPairedDevices,
    bluetoothEnabled,
    error,
    loadPairedDevices,
    connect,
    disconnect,
    refresh,
  } = useClassicBluetooth();

  const theme = isDarkMode ? 'dark' : 'light';
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // Load devices on mount
  useEffect(() => {
    if (bluetoothEnabled) {
      loadPairedDevices();
    }
  }, [bluetoothEnabled]);

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect
      await disconnect();
    } else {
      // Show paired devices
      if (!hasPairedDevices) {
        Alert.alert(
          'No Paired Devices',
          'Please pair your TH11 headset in your phone\'s Bluetooth settings first:\n\n1. Go to Settings → Bluetooth\n2. Turn on TH11 headset\n3. Tap "TH11" to pair\n4. Return to LDAS app',
          [
            { text: 'Open Settings', onPress: () => {/* Could open settings */} },
            { text: 'Refresh', onPress: () => loadPairedDevices() }
          ]
        );
      }
    }
  };

  const handleDeviceSelect = async (device) => {
    await connect(device);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
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
            
            <TouchableOpacity
              style={styles.themeToggle}
              onPress={toggleTheme}
            >
              <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
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
                        : colors.disconnected,
                    },
                  ]}
                />
                {isConnected && <View style={styles.pulse} />}
              </View>
              
              <View style={styles.statusText}>
                <Text style={[styles.statusTitle, { color: isConnected ? colors.white : themeColors.text }]}>
                  {isConnected
                    ? connectedDevice?.name || 'Connected'
                    : 'Not Connected'}
                </Text>
                <Text style={[styles.statusSubtitle, { color: isConnected ? colors.white80 : themeColors.textSecondary }]}>
                  {isConnected
                    ? 'Ready to use'
                    : hasPairedDevices
                    ? `${pairedDevices.length} paired device${pairedDevices.length !== 1 ? 's' : ''} available`
                    : 'No paired devices'}
                </Text>
              </View>
            </View>

            {/* Connection Button */}
            {!isConnected && (
              <Button
                title={
                  isLoading
                    ? 'Loading...'
                    : hasPairedDevices
                    ? 'Select Device Below'
                    : 'Pair Headset First'
                }
                onPress={handleConnect}
                variant="primary"
                size="huge"
                loading={isLoading}
                fullWidth
                gradient
                disabled={!hasPairedDevices}
                style={styles.connectionButton}
              />
            )}

            {isConnected && (
              <Button
                title="DISCONNECT"
                onPress={disconnect}
                variant="danger"
                size="huge"
                fullWidth
                style={styles.connectionButton}
              />
            )}
          </View>
        </Card>

        {/* Paired Devices List */}
        {!isConnected && hasPairedDevices && (
          <Card variant="elevated" theme={theme}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Your Paired Devices
            </Text>
            <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
              Tap a device to connect
            </Text>
            {pairedDevices.map((device) => (
              <TouchableOpacity
                key={device.address}
                style={[
                  styles.deviceItem,
                  { backgroundColor: themeColors.surfaceElevated },
                ]}
                onPress={() => handleDeviceSelect(device)}
                disabled={isConnecting}
              >
                <View style={styles.deviceInfo}>
                  <Text style={[styles.deviceName, { color: themeColors.text }]}>
                    🎧 {device.name || 'Unknown Device'}
                  </Text>
                  <Text style={[styles.deviceId, { color: themeColors.textSecondary }]}>
                    {device.address}
                  </Text>
                </View>
                {isConnecting && (
                  <Text style={[styles.connecting, { color: colors.primary }]}>
                    Connecting...
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Volume Control (when connected) */}
        {isConnected && (
          <Card variant="elevated" theme={theme}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Volume Control
            </Text>
            <VolumeControl theme={theme} />
          </Card>
        )}

        {/* Instructions (when not paired) */}
        {!hasPairedDevices && !isLoading && (
          <Card variant="flat" theme={theme}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              📱 How to Pair Your TH11 Headset
            </Text>
            <View style={styles.instructions}>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: colors.primary }]}>1</Text>
                <Text style={[styles.instructionText, { color: themeColors.text }]}>
                  Turn on your TH11 headset and put it in pairing mode
                </Text>
              </View>
              
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: colors.primary }]}>2</Text>
                <Text style={[styles.instructionText, { color: themeColors.text }]}>
                  Go to your phone's <Text style={{ fontWeight: 'bold' }}>Settings → Bluetooth</Text>
                </Text>
              </View>
              
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: colors.primary }]}>3</Text>
                <Text style={[styles.instructionText, { color: themeColors.text }]}>
                  Tap on "TH11" in the available devices list to pair
                </Text>
              </View>
              
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: colors.primary }]}>4</Text>
                <Text style={[styles.instructionText, { color: themeColors.text }]}>
                  Return to LDAS app and pull down to refresh
                </Text>
              </View>
            </View>

            <Button
              title="Refresh Device List"
              onPress={handleRefresh}
              variant="primary"
              size="large"
              fullWidth
              style={styles.refreshButton}
              theme={theme}
            />
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card variant="outlined" theme={theme} style={styles.errorCard}>
            <Text style={[styles.errorText, { color: colors.danger }]}>
              ⚠️ {error}
            </Text>
            <Button
              title="Retry"
              onPress={handleRefresh}
              variant="outline"
              size="small"
              style={styles.retryButton}
              theme={theme}
            />
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
  themeToggle: {
    padding: spacing.sm,
  },
  themeIcon: {
    fontSize: 28,
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
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.lg,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  deviceId: {
    ...typography.caption,
  },
  connecting: {
    ...typography.labelSmall,
  },
  instructions: {
    marginTop: spacing.md,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  stepNumber: {
    ...typography.h2,
    fontWeight: '900',
    marginRight: spacing.md,
    width: 32,
  },
  instructionText: {
    ...typography.body,
    flex: 1,
    lineHeight: 24,
  },
  refreshButton: {
    marginTop: spacing.xl,
  },
  errorCard: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
});

export default HomeScreen;