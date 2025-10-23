// src/services/BluetoothService.js
// FIXED: Bluetooth Low Energy Service for LDAS with better permissions

import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
    this.connectedDevice = null;
  }

  // Request Bluetooth permissions (Android 12+)
  async requestPermissions() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        try {
          const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
          
          console.log('Permissions:', permissions);
          
          const allGranted = 
            permissions['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
            permissions['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
            permissions['android.permission.ACCESS_FINE_LOCATION'] === 'granted';
          
          if (!allGranted) {
            Alert.alert(
              'Permissions Required',
              'LDAS needs Bluetooth and Location permissions to scan for devices. Please grant all permissions.',
              [{ text: 'OK' }]
            );
          }
          
          return allGranted;
        } catch (err) {
          console.error('Permission error:', err);
          return false;
        }
      } else {
        // Android 11 and below
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'LDAS needs location permission to scan for Bluetooth devices',
              buttonPositive: 'OK',
            }
          );
          
          if (granted !== 'granted') {
            Alert.alert(
              'Permission Required',
              'Location permission is required to scan for Bluetooth devices.',
              [{ text: 'OK' }]
            );
          }
          
          return granted === 'granted';
        } catch (err) {
          console.error('Permission error:', err);
          return false;
        }
      }
    }
    return true; // iOS handles permissions automatically
  }

  // Check if Bluetooth is enabled
  async isBluetoothEnabled() {
    try {
      const state = await this.manager.state();
      console.log('Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        Alert.alert(
          'Bluetooth Off',
          'Please turn on Bluetooth to scan for devices.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Bluetooth state error:', error);
      return false;
    }
  }

  // Scan for nearby Bluetooth devices
  scanDevices(onDeviceFound, onError, duration = 10000) {
    const devices = new Map();
    
    console.log('Starting device scan...');
    
    this.manager.startDeviceScan(
      null, // scan for all services
      { allowDuplicates: false }, // don't report same device multiple times
      (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          if (onError) {
            onError(error);
          }
          return;
        }

        if (device) {
          console.log('Found device:', device.name || device.id);
          
          // Add ALL devices (not just filtered ones for debugging)
          if (!devices.has(device.id)) {
            devices.set(device.id, {
              id: device.id,
              name: device.name || 'Unknown Device',
              rssi: device.rssi,
            });
            
            console.log('Total devices found:', devices.size);
            onDeviceFound(Array.from(devices.values()));
          }
        }
      }
    );

    // Stop scanning after duration
    setTimeout(() => {
      console.log('Stopping scan...');
      this.manager.stopDeviceScan();
    }, duration);
  }

  // Stop scanning
  stopScan() {
    console.log('Manual stop scan');
    this.manager.stopDeviceScan();
  }

  // Connect to a device
  async connect(deviceId, deviceName) {
    try {
      console.log('Connecting to:', deviceName, deviceId);
      
      // First, get the device
      const device = await this.manager.devices([deviceId]).then(devices => devices[0]);
      
      if (!device) {
        console.log('Device not found, trying direct connection...');
      }
      
      const connectedDevice = await this.manager.connectToDevice(deviceId, {
        requestMTU: 512,
        timeout: 10000,
      });

      console.log('Connected! Discovering services...');
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      this.connectedDevice = connectedDevice;
      
      // Monitor disconnection
      this.connectedDevice.onDisconnected((error, device) => {
        console.log('Device disconnected:', device?.name || device?.id);
        this.connectedDevice = null;
      });

      return {
        success: true,
        device: connectedDevice,
      };
    } catch (error) {
      console.error('Connection error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Disconnect from current device
  async disconnect() {
    if (this.connectedDevice) {
      try {
        await this.connectedDevice.cancelConnection();
        this.connectedDevice = null;
        return true;
      } catch (error) {
        console.error('Disconnect error:', error);
        return false;
      }
    }
    return true;
  }

  // Check if device is connected
  isConnected() {
    return this.connectedDevice !== null;
  }

  // Get connected device
  getConnectedDevice() {
    return this.connectedDevice;
  }

  // Read battery level (if supported)
  async getBatteryLevel() {
    if (!this.connectedDevice) return null;

    try {
      // Standard Battery Service UUID
      const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
      const BATTERY_LEVEL_CHAR = '00002a19-0000-1000-8000-00805f9b34fb';

      const characteristic = await this.connectedDevice.readCharacteristicForService(
        BATTERY_SERVICE,
        BATTERY_LEVEL_CHAR
      );

      if (characteristic && characteristic.value) {
        // Decode base64 value
        const batteryLevel = Buffer.from(characteristic.value, 'base64')[0];
        return batteryLevel;
      }
    } catch (error) {
      console.log('Battery reading not supported');
      return null;
    }
  }

  // Monitor battery level changes
  monitorBattery(callback) {
    if (!this.connectedDevice) return;

    try {
      const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
      const BATTERY_LEVEL_CHAR = '00002a19-0000-1000-8000-00805f9b34fb';

      this.connectedDevice.monitorCharacteristicForService(
        BATTERY_SERVICE,
        BATTERY_LEVEL_CHAR,
        (error, characteristic) => {
          if (error) {
            console.error('Battery monitoring error:', error);
            return;
          }

          if (characteristic && characteristic.value) {
            const batteryLevel = Buffer.from(characteristic.value, 'base64')[0];
            callback(batteryLevel);
          }
        }
      );
    } catch (error) {
      console.log('Battery monitoring not supported');
    }
  }

  // Get RSSI (signal strength)
  async getSignalStrength() {
    if (!this.connectedDevice) return null;

    try {
      const rssi = await this.connectedDevice.readRSSI();
      return rssi;
    } catch (error) {
      console.error('RSSI reading error:', error);
      return null;
    }
  }

  // Clean up
  destroy() {
    this.manager.destroy();
  }
}

// Singleton instance
const bluetoothService = new BluetoothService();

export default bluetoothService;