import React, { useState } from 'react';
import {ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import { Cloudinary } from 'cloudinary-react-native';

const Signup = () => {
  const navigation = useNavigation();
  const userId = uuid.v4();
  const [valid, setValid] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
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

  console.log("profilePic", profilePic)

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

  // Inside handleImagePicker function
  const handleImagePicker = async () => {
    setLoading(true);
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (!response.didCancel) {
        const formData = new FormData();
        formData.append('file', {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName
        });

        formData.append('upload_preset', 'akeunx8f');

        try {
          const res = await fetch('https://api.cloudinary.com/v1_1/reactcloudinary/image/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          const data = await res.json();

          if (data.secure_url) {
            setLoading(false);
            setProfilePic(data.secure_url);
          } else {
            // Handle error
            console.error('Failed to upload image to Cloudinary');
          }
        } catch (error) {
          // Handle error
          console.error('Error uploading image:', error);
        }
      }
    });
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const { name, email, password, mobile } = payload;
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Set display name for the user
      await userCredential.user.updateProfile({
        displayName: name,
        phoneNumber: mobile,
        photoURL: profilePic
      });

      // If user creation is successful, store additional user information in Firestore
      const userId = userCredential.user.uid;
      await firestore().collection('users').doc(userId).set({
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        userId: userId,
        profilePic: profilePic
      });

      // If user creation is successful, navigate to the login screen
      setLoading(false)
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Sign up</Text>

      {/* Display selected image in circle */}
      {profilePic && (
        <View style={styles.profilePicContainer}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        </View>
      )}
      {/* Image picker */}
      <TouchableOpacity onPress={handleImagePicker} style={styles.profilePicBtn}>
        <Text style={styles.profilePicText}>Select Profile Picture</Text>
      </TouchableOpacity>

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
        secureTextEntry={true}
        onChangeText={value => handleInputChange(value, 'password')}
      />
      <TextInput
        style={[styles.TextInput, { borderColor: borderColors.confirmPassword }]}
        placeholder="Enter confirm password"
        placeholderTextColor={'black'}
        secureTextEntry={true}
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
    marginTop: 40,
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
  profilePicBtn: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicText: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: '600',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it a circle
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
