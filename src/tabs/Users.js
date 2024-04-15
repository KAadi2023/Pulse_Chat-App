import {ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import Separator from '../components/Separator';
import UserItem from '../components/UserItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

let id = '';
const Users = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUsers();
  }, []);

  console.log('users', users);

  const getUsers = async () => {
    try {
      id = await AsyncStorage.getItem('userId');
      let tempData = [];
      const email = await AsyncStorage.getItem('email');
      console.log("id and email", id, email);
      firestore()
        .collection('users')
        .where('email', '!=', email)
        .get()
        .then(res => {
          if (res.docs != []) {
            res.docs.forEach(doc => {
              tempData.push(doc.data());
            });
            setUsers(tempData);
            setLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const currentUser = auth().currentUser;
      console.log("currentUser: ", currentUser)
      if (currentUser) {
        await auth().signOut(); // Sign out the user
        // You can navigate to a login screen or clear AsyncStorage data here
        // For example:
        // await AsyncStorage.clear();
        navigation.navigate('Login');
      } else {
        console.log('No user is currently signed in.');
        // Handle the case where no user is currently signed in
      }
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{
          height: 60,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image
            source={require('../image/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.headerText}>Pulse Chat</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={require('../image/logout.png')}
            style={styles.logoutImage}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.userItem}>
              <UserItem data={item} id={id} />
            </View>
          );
        }}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    elevation: 5,
  },
  logoImage: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginLeft: 15
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
    alignSelf: 'center',
    marginLeft: 10
  },
  userItem: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  logoutImage: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
    marginRight: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
