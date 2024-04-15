import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import firebase from '@react-native-firebase/app';

const App = () => {
  // Initialize Firebase when the app starts
  useEffect(() => {
    // Check if Firebase is already initialized to avoid reinitialization
    if (!firebase.apps.length) {
      // Replace firebaseConfig with your Firebase project configuration
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  return <AppNavigator />;
};

export default App;
