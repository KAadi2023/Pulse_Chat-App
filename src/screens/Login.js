import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-community/async-storage'
import auth from '@react-native-firebase/auth';

const Login = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [payload, setPayload] = useState({
    email: '',
    password: '',
  });

  console.log('payload', payload);

  const handleInputChange = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSignupClick = () => {
    navigation.navigate('Signup');
  };

  const loginUser = async () => {
    setVisible(true);
    try {
      const { email, password } = payload;
      const response = await auth().signInWithEmailAndPassword(email, password);
      setVisible(false);
      console.log('User logged in:', response.user);
      const data = response.user;
      goToNext(data.displayName, data.email, data.uid)
    } catch (error) {
      setVisible(false);
      console.log('Error logging in:', error);
      // Display an alert or handle the error appropriately
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    }
  };

  const goToNext = async (name, email, userId) => {
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('userId', userId);
    navigation.replace('Home');
  };

  return (
    <View style={styles.Container}>
      <View style={styles.CardContainer}>
        <Image
          source={require('../image/logo_1.png')}
          style={styles.Logo}
        />
        <Text style={styles.Title}>Sign in</Text>
        <Text style={styles.SubTitle}>(Please enter your credentials)</Text>
        <TextInput
          style={[styles.TextInput, { marginTop: 50 }]}
          id="email"
          placeholder="Enter email"
          placeholderTextColor={'black'}
          onChangeText={value => handleInputChange(value, 'email')}
        />
        <TextInput
          style={[styles.TextInput, { marginTop: 20 }]}
          placeholder="Enter password"
          placeholderTextColor={'black'}
          id="password"
          secureTextEntry={true}
          onChangeText={value => handleInputChange(value, 'password')}
        />
        <TouchableOpacity style={styles.SignUpBtn} onPress={() => loginUser()}>
          <Text style={styles.BtnText}>Sign In</Text>
        </TouchableOpacity>
        <Text onPress={handleSignupClick} style={styles.LoginText}>
          Or Sign up
        </Text>
        <Loader visible={visible} />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  CardContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#67e8f9',
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  Title: {
    fontSize: 30,
    alignSelf: 'center',
    fontWeight: '600',
    color: 'black',
  },
  SubTitle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'black',
  },
  TextInput: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingLeft: 20,
    fontSize: 20,
    color: 'black',
  },
  SignUpBtn: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    fontSize: 20,
    color: 'black',
    marginTop: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
  },
  LoginText: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 20,
    fontWeight: '600',
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
});
