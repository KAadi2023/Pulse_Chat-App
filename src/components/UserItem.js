import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';

// Get the dimensions of the screen
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const UserItem = ({ data, id, getUsers}) => {

  const navigation = useNavigation();
  const [message, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

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


  const latestMessageText = data?.lastMessage?.text;
  const latestMessageTime = formatTimestamp(data?.latestMessageTime);

  // console.log("users data:", data)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('ChatScreen', { data: data, id: id, getUsers: getUsers})}
    >
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
          >
            <Image style={styles.image} source={{
              uri: data?.profilePic ? data?.profilePic : 'https://res.cloudinary.com/reactcloudinary/image/upload/v1713248818/osdtiuq5ep43wdt5of5n.jpg',
            }} />
          </TouchableOpacity>
          <View>
            <Text style={styles.name}>{data?.name}</Text>
            <Text style={styles.latestMessage}>{latestMessageText}</Text>
          </View>
        </View>
        <Text style={styles.latestMessageTime}>{latestMessageTime}</Text>
      </View>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popover}>
            <Image style={styles.ModalImage} source={{
              uri: data?.profilePic,
            }} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderRadius: 20,
    alignSelf: 'center',
    marginRight: 20,
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
    position: 'absolute',
    right: 12, // Adjust as needed
    top: '50%', // Position at the center vertically
    transform: [{ translateY: -20 }] // Adjust based on font size to center vertically
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popover: {
    // backgroundColor: '#99f6e4',
    alignItems: 'center',
  },
  ModalImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.5,
    alignSelf: 'center',
    marginBottom: 20,
    objectFit: 'fill',
    borderRadius: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

