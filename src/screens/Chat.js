import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({route}) => {
  const [messages, setMessages] = React.useState([]);
  const navigation = useNavigation();
  const {data, id} = route.params;
  console.log('routeData', data, id);

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

  console.log("lats message",messages[0]);

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
            <Image
              source={require('../image/user.png')}
              style={styles.profilePic}
            />
            <Text style={styles.headerText}>{data.name}</Text>
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
          avatar: require('../image/user.png'),
        }}
        textInputProps={{
          style: {
            color: 'black',
            flex: 1,
          }
        }}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
});
