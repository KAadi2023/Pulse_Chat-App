import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Splash from '../screens/Splash';
import { NavigationContainer } from '@react-navigation/native';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Home from '../screens/Home';
import ChatScreen from '../screens/Chat';
// import { ZegoCallInvitationDialog, ZegoUIKitPrebuiltCallWaitingScreen, ZegoUIKitPrebuiltCallInCallScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <ZegoCallInvitationDialog /> */}
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          options={{ headerShown: false }}
          // DO NOT change the name 
          name="ZegoUIKitPrebuiltCallWaitingScreen"
          component={ZegoUIKitPrebuiltCallWaitingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallInCallScreen"
          component={ZegoUIKitPrebuiltCallInCallScreen}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
