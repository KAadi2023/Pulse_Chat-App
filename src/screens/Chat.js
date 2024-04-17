import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = React.useState([]);
  const navigation = useNavigation();
  const { data, id } = route.params;
  const [senderPic, setSenderPic] = useState('')
  const [isVisible, setIsVisible] = useState(false);

  console.log("chat data:", data)
  console.log("sendersPic:", senderPic)

  useEffect(() => {
    getCurrentUsers();
  }, []);


  const getCurrentUsers = async () => {
    const currentUser = auth().currentUser;
    setSenderPic(currentUser.photoURL)
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('Chats')
      .doc(id + data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    subscriber.onSnapshot(snapshot => {
      const allMessages = snapshot.docs.map(item => {
        return {
          ...item._data,
          createdAt: item._data.createdAt,
        };
      });
      setMessages(allMessages);
    });

    return () => subscriber();
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const mymsg = {
      ...msg,
      sendBy: id,
      sendTo: data.userId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));

    firestore()
      .collection('Chats')
      .doc('' + id + data.userId)
      .collection('messages')
      .add(mymsg);

    firestore()
      .collection('Chats')
      .doc('' + data.userId + id)
      .collection('messages')
      .add(mymsg);
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.LeftHeaderContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../image/previous.png')}
              style={styles.backBtn}
            />
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={{ flexDirection: 'row' }}
            >
              <Image style={styles.profilePic} source={{
                uri: data?.profilePic,
              }} />
              <Text style={styles.headerText}>{data.name}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.RightHeaderContainer}>
          <TouchableOpacity>
            <Image
              source={require('../image/call.png')}
              style={styles.CallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../image/videoCall.png')}
              style={styles.VideoCallIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: id,
          avatar: senderPic ? senderPic : require('../image/user.png'),
        }}
        textInputProps={{
          style: {
            color: 'black',
            flex: 1,
          }
        }}
      />
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
            <View style={styles.ProfileInfoContainer}>
              <Text style={styles.ProfileName}>{data?.name}</Text>
              <Text style={styles.ProfileEmail}>Email:
                <Text style={styles.ProfileEmailValue}> {data?.email}</Text>
              </Text>
              <Text style={styles.MobileNumber}>Mobile:
                <Text style={styles.MobileNumberValue}>{data?.mobile}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsVisible(false)}>
              <Text style={{ fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    color: 'white'
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
    elevation: 5,
  },
  LeftHeaderContainer: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RightHeaderContainer: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backBtn: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 10,
  },
  userDetails: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 25,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
    alignSelf: 'center',
    marginLeft: 15,
  },
  CallIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 20,
  },
  VideoCallIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
  },
  sendContainer: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popover: {
    backgroundColor: '#ccfbf1',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  ModalImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  ProfileInfoContainer: {
    width: '80%',
    height: 'auto',
    backgroundColor: '#d1d5db',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ProfileName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
    alignSelf: 'center',
  },
  ProfileEmail: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 15,
  },
  MobileNumber: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 15,
    marginBottom: 15,
  },
  ProfileEmailValue: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  MobileNumberValue: {
    fontSize: 15,
    fontWeight: 'normal',
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
