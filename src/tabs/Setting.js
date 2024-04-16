import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserProfile from '../components/UserProfile'

const Setting = () => {
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