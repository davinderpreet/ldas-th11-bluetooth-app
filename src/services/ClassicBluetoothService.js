// src/services/ClassicBluetoothService.js
// Classic Bluetooth Service for Already-Paired Devices (TH11)

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const BluetoothClassic = Platform.OS === 'android' 
  ? require('react-native-bluetooth-classic').default 
  : null;

class ClassicBluetoothService {
  constructor() {
    this.connectedDevice = null;
    this.eventEmitter = null;
    
    if (BluetoothClassic) {
      this.eventEmitter = new NativeEventEmitter(NativeModules.RNBluetoothClassic);
    }
  }

  // Request Bluetooth permissions
  async requestPermissions() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        try {
          const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          ]);
          
          return (
            permissions['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
            permissions['android.permission.BLUETOOTH_SCAN'] === 'granted'
          );
        } catch (err) {
          console.error('Permission error:', err);
          return false;
        }
      }
    }
    return true;
  }

  // Check if Bluetooth is enabled
  async isBluetoothEnabled() {
    try {
      if (!BluetoothClassic) return false;
      const enabled = await BluetoothClassic.isBluetoothEnabled();
      console.log('Bluetooth enabled:', enabled);
      return enabled;
    } catch (error) {
      console.error('Error checking Bluetooth:', error);
      return false;
    }
  }

  // Request to enable Bluetooth
  async requestBluetoothEnabled() {
    try {
      if (!BluetoothClassic) return false;
      const enabled = await BluetoothClassic.requestBluetoothEnabled();
      return enabled;
    } catch (error) {
      console.error('Error enabling Bluetooth:', error);
      return false;
    }
  }

  // Get list of bonded (paired) devices
  async getBondedDevices() {
    try {
      if (!BluetoothClassic) {
        console.log('BluetoothClassic not available');
        return [];
      }

      console.log('Getting bonded devices...');
      const devices = await BluetoothClassic.getBondedDevices();
      console.log('Bonded devices:', devices);
      
      // Filter for audio devices (headsets)
      const audioDevices = devices.filter(device => {
        const name = (device.name || '').toLowerCase();
        // Look for common headset indicators
        return name.includes('th11') || 
               name.includes('headset') || 
               name.includes('audio') ||
               device.deviceClass === 'AUDIO_VIDEO';
      });

      console.log('Filtered audio devices:', audioDevices);
      
      // Return all devices if no audio devices found (for testing)
      return audioDevices.length > 0 ? audioDevices : devices;
    } catch (error) {
      console.error('Error getting bonded devices:', error);
      return [];
    }
  }

  // Connect to a paired device
  async connect(device) {
    try {
      console.log('Connecting to:', device.name, device.address);
      
      if (!BluetoothClassic) {
        throw new Error('BluetoothClassic not available');
      }

      // Check if already connected
      const isConnected = await device.isConnected();
      if (isConnected) {
        console.log('Already connected');
        this.connectedDevice = device;
        return { success: true, device };
      }

      // Connect to device
      const connected = await BluetoothClassic.connectToDevice(device.address);
      console.log('Connection result:', connected);
      
      this.connectedDevice = connected;
      
      // Set up disconnection listener
      this.setupDisconnectionListener();
      
      return { success: true, device: connected };
    } catch (error) {
      console.error('Connection error:', error);
      return { success: false, error: error.message };
    }
  }

  // Setup disconnection listener
  setupDisconnectionListener() {
    if (this.eventEmitter) {
      this.eventEmitter.addListener('onDeviceDisconnected', (event) => {
        console.log('Device disconnected:', event);
        this.connectedDevice = null;
      });
    }
  }

  // Disconnect from device
  async disconnect() {
    try {
      if (this.connectedDevice && BluetoothClassic) {
        console.log('Disconnecting...');
        await BluetoothClassic.disconnectFromDevice(this.connectedDevice.address);
        this.connectedDevice = null;
        return true;
      }
      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      return false;
    }
  }

  // Check if connected
  isConnected() {
    return this.connectedDevice !== null;
  }

  // Get connected device
  getConnectedDevice() {
    return this.connectedDevice;
  }

  // Send command to device (if supported)
  async sendCommand(command) {
    try {
      if (!this.connectedDevice || !BluetoothClassic) {
        throw new Error('No device connected');
      }

      await BluetoothClassic.writeToDevice(this.connectedDevice.address, command);
      return true;
    } catch (error) {
      console.error('Send command error:', error);
      return false;
    }
  }

  // Clean up
  destroy() {
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners('onDeviceDisconnected');
    }
  }
}

// Singleton instance
const classicBluetoothService = new ClassicBluetoothService();

export default classicBluetoothService;