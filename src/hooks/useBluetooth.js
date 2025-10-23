// src/hooks/useBluetooth.js
// FIXED: Custom React Hook for Bluetooth Management

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import bluetoothService from '../services/BluetoothService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ldas_last_device';

export const useBluetooth = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [signalStrength, setSignalStrength] = useState(null);
  const [error, setError] = useState(null);

  // Check Bluetooth status on mount
  useEffect(() => {
    checkBluetoothStatus();
    loadLastDevice();
  }, []);

  // Check if Bluetooth is enabled
  const checkBluetoothStatus = async () => {
    const enabled = await bluetoothService.isBluetoothEnabled();
    setBluetoothEnabled(enabled);
    return enabled;
  };

  // Load last connected device
  const loadLastDevice = async () => {
    try {
      const lastDeviceId = await AsyncStorage.getItem(STORAGE_KEY);
      if (lastDeviceId) {
        console.log('Last device:', lastDeviceId);
      }
    } catch (error) {
      console.error('Error loading last device:', error);
    }
  };

  // Save last connected device
  const saveLastDevice = async (deviceId) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, deviceId);
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  // Request permissions
  const requestPermissions = async () => {
    try {
      const granted = await bluetoothService.requestPermissions();
      if (!granted) {
        setError('Bluetooth permissions not granted');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      setError(error.message);
      return false;
    }
  };

  // Start scanning for devices
  const startScan = useCallback(async () => {
    try {
      console.log('Starting scan...');
      setError(null);
      
      // Check Bluetooth first
      const btEnabled = await checkBluetoothStatus();
      if (!btEnabled) {
        setError('Bluetooth is not enabled');
        return;
      }
      
      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Permissions not granted');
        return;
      }
      
      setIsScanning(true);
      setDevices([]);
      
      console.log('Permissions granted, starting scan...');
      
      bluetoothService.scanDevices(
        (foundDevices) => {
          console.log('Devices updated:', foundDevices.length);
          setDevices(foundDevices);
        },
        (error) => {
          console.error('Scan error:', error);
          setError(error.message);
          setIsScanning(false);
        },
        10000
      );
      
      // Stop scanning after 10 seconds
      setTimeout(() => {
        console.log('Scan timeout');
        setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.error('Scan error:', error);
      setError(error.message);
      setIsScanning(false);
      
      Alert.alert(
        'Scan Error',
        error.message || 'Failed to start scanning',
        [{ text: 'OK' }]
      );
    }
  }, []);

  // Stop scanning
  const stopScan = useCallback(() => {
    bluetoothService.stopScan();
    setIsScanning(false);
  }, []);

  // Connect to device
  const connect = useCallback(async (device) => {
    try {
      console.log('Attempting connection to:', device.name);
      setIsConnecting(true);
      setError(null);
      
      const result = await bluetoothService.connect(device.id, device.name);
      
      if (result.success) {
        console.log('Connection successful!');
        setConnectedDevice(result.device);
        await saveLastDevice(device.id);
        
        // Start monitoring battery
        monitorBattery();
        
        // Get initial signal strength
        updateSignalStrength();
        
        return { success: true };
      } else {
        console.log('Connection failed:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    try {
      console.log('Disconnecting...');
      await bluetoothService.disconnect();
      setConnectedDevice(null);
      setBatteryLevel(null);
      setSignalStrength(null);
      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      return false;
    }
  }, []);

  // Monitor battery level
  const monitorBattery = useCallback(() => {
    bluetoothService.monitorBattery((level) => {
      console.log('Battery level:', level);
      setBatteryLevel(level);
    });
    
    // Also try to read once immediately
    setTimeout(async () => {
      const level = await bluetoothService.getBatteryLevel();
      if (level !== null) {
        console.log('Initial battery level:', level);
        setBatteryLevel(level);
      }
    }, 1000);
  }, []);

  // Update signal strength
  const updateSignalStrength = useCallback(async () => {
    const rssi = await bluetoothService.getSignalStrength();
    if (rssi !== null) {
      // Convert RSSI to signal strength (0-100)
      const strength = Math.max(0, Math.min(100, (rssi + 100) * 1.67));
      setSignalStrength(Math.round(strength));
    }
  }, []);

  // Get signal strength label
  const getSignalLabel = () => {
    if (signalStrength === null) return 'Unknown';
    if (signalStrength >= 80) return 'Excellent';
    if (signalStrength >= 60) return 'Good';
    if (signalStrength >= 40) return 'Fair';
    return 'Weak';
  };

  // Auto-update signal strength when connected
  useEffect(() => {
    if (connectedDevice) {
      const interval = setInterval(() => {
        updateSignalStrength();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [connectedDevice, updateSignalStrength]);

  return {
    // State
    devices,
    connectedDevice,
    isScanning,
    isConnecting,
    bluetoothEnabled,
    batteryLevel,
    signalStrength,
    error,
    
    // Methods
    startScan,
    stopScan,
    connect,
    disconnect,
    checkBluetoothStatus,
    requestPermissions,
    
    // Computed
    isConnected: connectedDevice !== null,
    signalLabel: getSignalLabel(),
  };
};

export default useBluetooth;