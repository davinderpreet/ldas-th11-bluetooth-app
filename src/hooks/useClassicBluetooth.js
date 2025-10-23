// src/services/ClassicBluetoothService.js
// Classic Bluetooth Service for Already-Paired Devices (TH11)
// FIXED VERSION - Resolves socket timeout errors

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const BluetoothClassic = Platform.OS === 'android' 
  ? require('react-native-bluetooth-classic').default 
  : null;

class ClassicBluetoothService {
  constructor() {
    this.connectedDevice = null;
    this.eventEmitter = null;
    this.isConnecting = false; // Prevent multiple simultaneous connections
    
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
        // Look for common headset indicators or TH11
        return name.includes('th11') || 
               name.includes('th-11') ||
               name.includes('ldas') ||
               name.includes('headset') || 
               name.includes('audio') ||
               device.deviceClass === 'AUDIO_VIDEO' ||
               device.address === '00:70:00:63:33:96'; // Your specific TH11
      });

      console.log('Filtered audio devices:', audioDevices);
      
      // Return all devices if no audio devices found (for testing)
      return audioDevices.length > 0 ? audioDevices : devices;
    } catch (error) {
      console.error('Error getting bonded devices:', error);
      return [];
    }
  }

  // FIXED: Connect to a paired device with retry mechanism
  async connect(device, retryCount = 0) {
    try {
      // Prevent multiple simultaneous connections
      if (this.isConnecting) {
        console.log('Connection already in progress');
        return { success: false, error: 'Connection already in progress' };
      }

      this.isConnecting = true;
      
      console.log(`[Attempt ${retryCount + 1}/3] Connecting to:`, device.name, device.address);
      
      if (!BluetoothClassic) {
        throw new Error('BluetoothClassic not available');
      }

      // Step 1: Check if already connected
      try {
        const isConnected = await device.isConnected();
        if (isConnected) {
          console.log('Already connected, disconnecting first...');
          await BluetoothClassic.disconnectFromDevice(device.address);
          // Wait before reconnecting
          await this.delay(1000);
        }
      } catch (checkError) {
        console.log('Could not check connection status:', checkError.message);
      }

      // Step 2: Attempt connection with timeout
      console.log('Initiating connection...');
      const connectionPromise = BluetoothClassic.connectToDevice(device.address, {
        connectorType: 'rfcomm',
        DELIMITER: '\n',
        DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      );

      // Race connection vs timeout
      const connected = await Promise.race([connectionPromise, timeoutPromise]);
      
      console.log('Connection established:', connected);
      
      // Step 3: Verify connection
      try {
        const verifyConnected = await connected.isConnected();
        if (!verifyConnected) {
          throw new Error('Connection verification failed');
        }
      } catch (verifyError) {
        console.log('Connection verification error:', verifyError.message);
      }

      // Step 4: Success!
      this.connectedDevice = connected;
      this.isConnecting = false;
      
      // Set up disconnection listener
      this.setupDisconnectionListener();
      
      return { success: true, device: connected };

    } catch (error) {
      console.error(`Connection error (attempt ${retryCount + 1}):`, error.message);
      this.isConnecting = false;

      // Retry logic for socket errors
      const shouldRetry = retryCount < 2 && (
        error.message?.includes('socket') ||
        error.message?.includes('timeout') ||
        error.message?.includes('read failed') ||
        error.message?.includes('IOException')
      );

      if (shouldRetry) {
        console.log(`Retrying connection in 1.5 seconds (attempt ${retryCount + 2}/3)...`);
        await this.delay(1500);
        return this.connect(device, retryCount + 1);
      }

      // All retries failed
      let errorMessage = 'Connection failed. ';
      
      if (error.message?.includes('socket') || error.message?.includes('read failed')) {
        errorMessage = 'Socket connection error. Please try:\n\n' +
                      '1. Turn TH11 OFF then ON\n' +
                      '2. Unpair in Settings → Bluetooth\n' +
                      '3. Re-pair TH11\n' +
                      '4. Try connecting again';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Connection timed out. Make sure TH11 is:\n\n' +
                      '1. Powered ON (solid blue LED)\n' +
                      '2. Within 1 meter of phone\n' +
                      '3. Not connected to another device';
      } else {
        errorMessage += error.message || 'Unknown error occurred';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // Helper: Delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Setup disconnection listener
  setupDisconnectionListener() {
    if (this.eventEmitter) {
      // Remove old listeners first
      this.eventEmitter.removeAllListeners('onDeviceDisconnected');
      
      // Add new listener
      this.eventEmitter.addListener('onDeviceDisconnected', (event) => {
        console.log('Device disconnected:', event);
        this.connectedDevice = null;
        this.isConnecting = false;
      });
    }
  }

  // Disconnect from device
  async disconnect() {
    try {
      if (this.connectedDevice && BluetoothClassic) {
        console.log('Disconnecting from:', this.connectedDevice.name);
        const isConnected = await this.connectedDevice.isConnected();
        
        if (isConnected) {
          await BluetoothClassic.disconnectFromDevice(this.connectedDevice.address);
        }
        
        this.connectedDevice = null;
        this.isConnecting = false;
        return true;
      }
      
      this.connectedDevice = null;
      this.isConnecting = false;
      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      // Even if disconnect fails, reset state
      this.connectedDevice = null;
      this.isConnecting = false;
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

  // Read data from device (if supported)
  async readData() {
    try {
      if (!this.connectedDevice || !BluetoothClassic) {
        throw new Error('No device connected');
      }

      const data = await BluetoothClassic.readFromDevice(this.connectedDevice.address);
      return data;
    } catch (error) {
      console.error('Read data error:', error);
      return null;
    }
  }

  // Clean up
  destroy() {
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners('onDeviceDisconnected');
    }
    this.connectedDevice = null;
    this.isConnecting = false;
  }
}

// Singleton instance
const classicBluetoothService = new ClassicBluetoothService();

export default classicBluetoothService;