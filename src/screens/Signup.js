import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import {} from 'react-native-i'

const Signup = () => {
  const navigation = useNavigation();
  const userId = uuid.v4();
  const [valid, setValid] = useState(false);
  const [borderColors, setBorderColors] = useState({
    name: 'black',
    email: 'black',
    mobile: 'black',
    password: 'black',
    confirmPassword: 'black',
  });
  const [payload, setPayload] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });

    // Reset validation status
    // setValid(true);

    // Validate individual fields
    if (value === '') {
      setValid(false);
      setBorderColors({ ...borderColors, [name]: 'red' });
    } else {
      setValid(true);
      setBorderColors({ ...borderColors, [name]: 'green' });
    }
  };

  const registerUser = async () => {
    try {
      const { name, email, password, mobile } = payload;
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Set display name for the user
      await userCredential.user.updateProfile({
        displayName: name,
        phoneNumber: mobile,
        photoURL: ''
      });

      // If user creation is successful, store additional user information in Firestore
      const userId = userCredential.user.uid;
      await firestore().collection('users').doc(userId).set({
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        userId: userId,
      });

      // If user creation is successful, navigate to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error creating user:', error);
      // Display an alert or handle the error appropriately
      Alert.alert('Error', 'Failed to create user account. Please try again.');
    }
  };

  const handleLoginClick = () => {
    navigation.goBack();
  };

  console.log("payload", payload);
  console.log("valid", valid);

  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Sign up</Text>
      <TextInput
        style={[styles.TextInput, { borderColor: borderColors.name }]}
        placeholder="Enter name"
        placeholderTextColor={'black'}
        onChangeText={value => handleInputChange(value, 'name')}
      />
      <TextInput
        style={[styles.TextInput, { borderColor: borderColors.email }]}
        placeholder="Enter email"
        placeholderTextColor={'black'}
        onChangeText={value => handleInputChange(value, 'email')}
      />
      <TextInput
        keyboardType={'number-pad'}
        style={[styles.TextInput, { borderColor: borderColors.mobile }]}
        placeholder="Enter mobile"
        placeholderTextColor={'black'}
        onChangeText={value => handleInputChange(value, 'mobile')}
      />
      <TextInput
        style={[styles.TextInput, { borderColor: borderColors.password }]}
        placeholder="Enter password"
        placeholderTextColor={'black'}
        onChangeText={value => handleInputChange(value, 'password')}
      />
      <TextInput
        style={[styles.TextInput, { borderColor: borderColors.confirmPassword }]}
        placeholder="Enter confirm password"
        placeholderTextColor={'black'}
        onChangeText={value => handleInputChange(value, 'confirmPassword')}
      />
      <TouchableOpacity
        style={[styles.SignUpBtn, { backgroundColor: valid ? '#2563eb' : 'gray' }]}
        onPress={() => {
          if (valid) {
            registerUser();
          } else {
            Alert.alert('Please Enter Correct Data!!');
          }
        }}>
        <Text style={styles.BtnText}>Sign Up</Text>
      </TouchableOpacity>
      <Text onPress={handleLoginClick} style={styles.LoginText}>
        Or Login
      </Text>
    </View>
  );
};

export default Signup;

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
    borderRadius: 10,
    paddingLeft: 20,
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
  },
  SignUpBtn: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    color: 'black',
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
