import {
  Image,
  ImageBackground,
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
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Dimensions } from 'react-native';

// Get the dimensions of the screen
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = React.useState([]);
  const navigation = useNavigation();
  const { data, id, getUsers } = route.params;
  const [senderPic, setSenderPic] = useState('')
  const [isVisible, setIsVisible] = useState(false);

  // console.log("sendersPic:", senderPic)
  // console.log("messages:", messages)

  useEffect(() => {
    getCurrentUsers();
    subscribeToMessages();
  }, []);


  const getCurrentUsers = async () => {
    const currentUser = auth().currentUser;
    setSenderPic(currentUser.photoURL)
  };

  const subscribeToMessages = () => {
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
  };


  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const mymsg = {
      ...msg,
      sendBy: id,
      sendTo: data.userId,
      createdAt: Date.parse(msg.createdAt),
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));

    try {
      await firestore()
        .collection('Chats')
        .doc('' + id + data.userId)
        .collection('messages')
        .add(mymsg);

      await firestore()
        .collection('Chats')
        .doc('' + data.userId + id)
        .collection('messages')
        .add(mymsg);

      const recipientToken = data.deviceToken;
      console.log("recipientToken: ", recipientToken)
      const key = Date.now().toString();

      const legacyServerKey = 'AAAAYPaoGn0:APA91bEBU55wcsEwxepsdfQUw9a6JxliuN1H1J8IFnWboxzbegF8Sa7IFEtM0WA6t1N2TnPLzaKkrdYEpGVQzPUAqL5Favz9D5t5cxZYC5Iov5dVoKUT50QzicrMmD15uzmwtZLmDYBw';

      const endpoint = 'https://fcm.googleapis.com/fcm/send';
      const headers = new Headers({
        'Authorization': 'key=' + legacyServerKey,
        'Content-Type': 'application/json'
      });

      const messagePayload = {
        to: recipientToken,
        notification: {
          title: msg.text,
          body: `you have a new message from ${auth().currentUser.displayName} `
        }
      };

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(messagePayload)
      };

      fetch(endpoint, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to send message: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log('Message sent successfully:', data);
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });

      getUsers();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, []);

  // Custom renderInputToolbar method for input area customization
  const renderInputToolbar = (props) => {
    // Customize your input toolbar UI here
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.customInputToolbar}
      />
    );
  };

  // Custom renderSend method to customize the send button
  const renderSend = (props) => {
    // Customize your send button UI here
    return (
      <Send {...props}>
        <View style={styles.customSendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

  // Custom renderBubble method to apply margin bottom to the message container
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            marginBottom: 5,
          }, // Add styles for messages on the left side
          right: {
            marginBottom: 5,
          }, // Add styles for messages on the right side
        }}
      />
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.LeftHeaderContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              navigation.goBack()
              getUsers()
            }}>
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
      <ImageBackground
        source={require('../image/bg-img/bg-img-7.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: id,
            avatar: senderPic ? senderPic : require('../image/user.png'),
          }}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderBubble={renderBubble}
        // messagesContainerStyle={{ ...styles.GiftedChatContainer }} Remove this line
        />
      </ImageBackground>
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
    backgroundColor: '#22d3ee',
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
    marginBottom: 5,
    objectFit: 'fill',
    borderRadius: 15,
  },
  ProfileInfoContainer: {
    width: screenWidth * 0.9,
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
  customInputToolbar: {
    backgroundColor: '#F5FCFF',
    color: 'black',
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 10,
    // paddingVertical: 5,
    // marginBottom: 10,
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  customSendButton: {},
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
