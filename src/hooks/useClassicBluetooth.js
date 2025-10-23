// src/hooks/useClassicBluetooth.js
// Custom Hook for Classic Bluetooth (Paired Devices)

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import classicBluetoothService from '../services/ClassicBluetoothService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ldas_last_device';

export const useClassicBluetooth = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [error, setError] = useState(null);

  // Check Bluetooth status on mount
  useEffect(() => {
    initBluetooth();
  }, []);

  // Initialize Bluetooth
  const initBluetooth = async () => {
    try {
      const enabled = await classicBluetoothService.isBluetoothEnabled();
      setBluetoothEnabled(enabled);
      
      if (!enabled) {
        // Try to enable Bluetooth
        const result = await classicBluetoothService.requestBluetoothEnabled();
        setBluetoothEnabled(result);
      }
      
      if (enabled) {
        // Load paired devices automatically
        await loadPairedDevices();
      }
    } catch (error) {
      console.error('Init Bluetooth error:', error);
      setError(error.message);
    }
  };

  // Load last connected device
  const loadLastDevice = async () => {
    try {
      const lastDeviceAddress = await AsyncStorage.getItem(STORAGE_KEY);
      return lastDeviceAddress;
    } catch (error) {
      console.error('Error loading last device:', error);
      return null;
    }
  };

  // Save last connected device
  const saveLastDevice = async (deviceAddress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, deviceAddress);
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  // Request permissions
  const requestPermissions = async () => {
    try {
      const granted = await classicBluetoothService.requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'LDAS needs Bluetooth permissions to connect to your headset.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  // Load paired devices from phone settings
  const loadPairedDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading paired devices...');
      
      // Check permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Permissions not granted');
        return;
      }

      // Check Bluetooth enabled
      const enabled = await classicBluetoothService.isBluetoothEnabled();
      if (!enabled) {
        setError('Bluetooth is not enabled');
        Alert.alert(
          'Bluetooth Off',
          'Please enable Bluetooth in your phone settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get bonded devices
      const devices = await classicBluetoothService.getBondedDevices();
      console.log('Got devices:', devices);
      
      setPairedDevices(devices);
      
      if (devices.length === 0) {
        Alert.alert(
          'No Paired Devices',
          'Please pair your TH11 headset in your phone\'s Bluetooth settings first, then return to this app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Load devices error:', error);
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to a device
  const connect = useCallback(async (device) => {
    try {
      console.log('Attempting connection...');
      setIsConnecting(true);
      setError(null);

      const result = await classicBluetoothService.connect(device);
      
      if (result.success) {
        console.log('Connected successfully!');
        setConnectedDevice(result.device);
        await saveLastDevice(device.address);
        
        Alert.alert(
          'Connected!',
          `Connected to ${device.name}`,
          [{ text: 'OK' }]
        );
        
        return { success: true };
      } else {
        console.log('Connection failed:', result.error);
        setError(result.error);
        
        Alert.alert(
          'Connection Failed',
          result.error || 'Could not connect to device. Make sure it\'s turned on and in range.',
          [{ text: 'OK' }]
        );
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Connect error:', error);
      setError(error.message);
      Alert.alert('Error', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    try {
      console.log('Disconnecting...');
      const success = await classicBluetoothService.disconnect();
      
      if (success) {
        setConnectedDevice(null);
        Alert.alert('Disconnected', 'Device has been disconnected');
      }
      
      return success;
    } catch (error) {
      console.error('Disconnect error:', error);
      return false;
    }
  }, []);

  // Refresh/reload devices
  const refresh = useCallback(async () => {
    await loadPairedDevices();
  }, [loadPairedDevices]);

  return {
    // State
    pairedDevices,
    connectedDevice,
    isLoading,
    isConnecting,
    bluetoothEnabled,
    error,
    
    // Methods
    loadPairedDevices,
    connect,
    disconnect,
    refresh,
    initBluetooth,
    
    // Computed
    isConnected: connectedDevice !== null,
    hasPairedDevices: pairedDevices.length > 0,
  };
};

export default useClassicBluetooth;