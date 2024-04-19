import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import RemoteNotification from './RemoteNotification';

const firebaseConfig = {
  apiKey: "AIzaSyAZu7jX0KSHyZoYlIMFTCVnjjpUytzg4iw",
  authDomain: `pulse-7af98.firebaseapp.com`,
  databaseURL: `https://pulse-7af98.firebaseio.com`,
  projectId: `pulse-7af98`,
  storageBucket: `pulse-7af98.appspot.com`,
  messagingSenderId: "416455072381",
  appId: "1:416455072381:android:78eb822a0b33c23611af14",
  // measurementId: "G-XXXXXXXXXX"
};

const App = () => {
  // Initialize Firebase when the app starts
  useEffect(() => {
    // Check if Firebase is already initialized to avoid reinitialization
    if (firebase.apps.length) {
      // Replace firebaseConfig with your Firebase project configuration
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  // Initialize Firebase Messaging
  const initFirebaseMessaging = async () => {
    await messaging().registerDeviceForRemoteMessages(); // Required for some versions
  };
  initFirebaseMessaging();


  return (<>
    <AppNavigator />
    <RemoteNotification />
  </>
  );
};

export default App;
