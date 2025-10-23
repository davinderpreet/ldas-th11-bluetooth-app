// App.js
// LDAS Main Application Entry Point

import React from 'react';
import { LogBox } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'new NativeEventEmitter',
  'Animated: `useNativeDriver`',
]);

const App = () => {
  return <HomeScreen />;
};

export default App;