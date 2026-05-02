import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileScreen />
    </SafeAreaProvider>
  );
}
