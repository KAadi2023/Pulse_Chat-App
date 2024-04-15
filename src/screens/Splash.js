import { Image, StyleSheet, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const Splash = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      checkLogin();
    }, 2000);

    // Start the animation when the component mounts
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(scaleAnim, {
      toValue: 2.5, // Scale the image to 1.5 times its original size
      duration: 2000, // Duration of the animation in milliseconds
      useNativeDriver: true, // Improves performance
    }).start();
  };

  const checkLogin = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id !== null) {
        navigation.replace('Home');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.Container}>
      <Animated.Image
        source={require('../image/logo_1.png')}
        style={[styles.Logo, { transform: [{ scale: scaleAnim }] }]}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#02a1a4',
  },
  Logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
