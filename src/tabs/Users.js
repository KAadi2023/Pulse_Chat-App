import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import Separator from '../components/Separator';
import UserItem from '../components/UserItem';

let id = '';
const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);

  console.log('users', users);

  const getUsers = async () => {
    try {
      id = await AsyncStorage.getItem('userId');
      let tempData = [];
      const email = await AsyncStorage.getItem('email');
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
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pulse Chat</Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item, index}) => {
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    elevation: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
  },
  userItem: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});
