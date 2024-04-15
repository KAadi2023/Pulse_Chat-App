import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Users from '../tabs/Users';
import Setting from '../tabs/Setting';

const Home = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {selectedTab === 0 ? <Users /> : <Setting />}
      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(0)}>
          <Image
            source={require('../image/users.png')}
            style={[
              styles.tabIcon,
              {tintColor: selectedTab === 0 ? 'white' : 'grey'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab(1)}>
          <Image
            source={require('../image/setting.png')}
            style={[
              styles.tabIcon,
              {tintColor: selectedTab === 1 ? 'white' : 'grey'},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  bottomTabs: {
    position: 'absolute',
    backgroundColor: '#2563eb',
    width: '100%',
    height: 70,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
});
