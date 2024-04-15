import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const UserItem = ({ data, id }) => {
  const navigation = useNavigation();
  const [message, setMessages] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Chats')
      .doc(id + data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMessages = snapshot.docs.map(item => ({
          ...item.data(),
          createdAt: item.data().createdAt,
        }));
        setMessages(allMessages);
      });

    return () => subscriber();
  }, []);

  function formatTimestamp(timestamp) {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();
  
    // Check if the message was sent today
    if (messageDate.toDateString() === currentDate.toDateString()) {
      // Display time if it was sent today
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Display date if it was sent on a previous day
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
  

  const latestMessageText = message.length > 0 ? message[0].text : '';
  const latestMessageTime = message.length > 0 ? formatTimestamp(message[0].createdAt) : '';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('ChatScreen', { data: data, id: id })}
    >
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Image style={styles.image} source={require('../image/user.png')} />
          <View>
            <Text style={styles.name}>{data?.name}</Text>
            <Text style={styles.latestMessage}>{latestMessageText}</Text>
          </View>
        </View>
        <Text style={styles.latestMessageTime}>{latestMessageTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
  },
  name: {
    marginBottom: 4,
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
  latestMessage: {
    fontSize: 14,
    color: 'gray',
  },
  latestMessageTime: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-start',
    marginRight: 20 // Adjust alignment as needed
  },
});
