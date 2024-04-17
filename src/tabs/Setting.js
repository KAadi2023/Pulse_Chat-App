import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import UserProfile from '../components/UserProfile'

const Setting = () => {
  const [data, setData] = useState({});
  return (
    <View style={styles.Container}>
      <UserProfile />
    </View>
  )
}

export default Setting

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})