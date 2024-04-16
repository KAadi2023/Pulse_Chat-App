import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [additionaldetails, setAdditionalDetails] = useState({});
  const [loading, setLoading] = useState(false);

  console.log("currentUser", currentUser);
  console.log("additionalDetails", additionaldetails);

  useEffect(() => {
    getCurrentUser();
    getUsers();
  }, [])

  const getCurrentUser = () => {
    const currentUser = auth().currentUser;
    setAdditionalDetails(currentUser);
  }

  const getUsers = async () => {
    setLoading(true);
    try {
      let tempData = [];
      const email = await AsyncStorage.getItem('email');
      firestore()
        .collection('users')
        .where('email', '==', email)
        .get()
        .then(res => {
          if (res.docs != []) {
            res.docs.forEach(doc => {
              tempData.push(doc.data());
            });
            setCurrentUser(tempData[0]);
            setLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.Container}>
      <View style={styles.header}>
        <View style={{
          height: 60,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={styles.headerText}>Profile Details</Text>
        </View>
      </View>
      <View style={styles.ProfiledetailsContainer}>
        <View style={styles.ProfilePicContainer}>
          <Image
            style={styles.ProfilePic}
            source={{ uri: currentUser?.profilePic }}
          />
        </View>
        <View style={styles.ProfileInfoContainer}>
          <Text style={styles.ProfileName}>{currentUser?.name}</Text>
          <Text style={styles.ProfileEmail}>Email:
            <Text style={styles.ProfileEmailValue}> {currentUser?.email}</Text>
          </Text>
          <Text style={styles.MobileNumber}>Mobile:
            <Text style={styles.MobileNumberValue}>{currentUser?.mobile}</Text>
          </Text>
          <Text style={styles.LastSignInTime}>Last Signin Time:
            <Text style={styles.LastSignInTimeValue}>{additionaldetails?.metadata?.lastSignInTime}</Text>
          </Text>
          <Text style={styles.CreationTime}>Account Creation Time:
            <Text style={styles.CreationTimeValue}>{additionaldetails?.metadata?.creationTime}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.SettingConatiner}>

      </View>
    </View>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    elevation: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
    alignSelf: 'center',
    marginLeft: 10
  },
  ProfiledetailsContainer: {
    flex: 1,
    width: '90%',
    height: '60%',
    alignItems: 'center',
    backgroundColor: '#22d3ee',
    marginTop: 20,
    marginBottom: 20,
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
  ProfilePicContainer: {
    width: 200,
    height: 200,
    borderRadius: 30,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ProfilePic: {
    width: 200,
    height: 200,
    borderRadius: 30,
    alignSelf: 'center',
    resizeMode: 'fit',
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ProfileInfoContainer: {
    width: '90%',
    height: 'auto',
    backgroundColor: '#d1d5db',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 20,
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
  },
  CreationTime: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
    marginLeft: 15,
  },
  LastSignInTime: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 15,
  },
  ProfileEmailValue: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  MobileNumberValue: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  CreationTimeValue: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  LastSignInTimeValue: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  SettingConatiner: {
    width: '90%',
    height: '40%',
    // backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})