import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-community/async-storage'

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

  const loginUser = () => {
    setVisible(true);
    firestore()
      .collection('users')
      .where('email', '==', payload.email)
      .get()
      .then(res => {
        setVisible(false);
        console.log('response: ', res.docs[0].data());
        const data = res.docs[0].data();
        goToNext(data.name, data.email, data.userId);
        // Alert.alert('User Found.');
      })
      .catch(error => {
        setVisible(false);
        console.log(error);
      });
  };

  const goToNext = async (name, email, userId) => {
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('userId', userId);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Sign in</Text>
      <TextInput
        style={[styles.TextInput, {marginTop: 50}]}
        id="email"
        placeholder="Enter email"
        placeholderTextColor={'black'}
        onChangeText={value => handleInputChange(value, 'email')}
      />
      <TextInput
        style={[styles.TextInput, {marginTop: 20}]}
        placeholder="Enter password"
        placeholderTextColor={'black'}
        id="password"
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
  );
};

export default Login;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  Title: {
    fontSize: 30,
    alignSelf: 'center',
    marginTop: 100,
    fontWeight: '600',
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
