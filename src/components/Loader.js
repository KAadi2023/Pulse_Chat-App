import {ActivityIndicator, Dimensions, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.ModalView}>
        <View style={styles.MainView}>
            <ActivityIndicator size={'large'} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
    ModalView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    MainView: {
      backgroundColor: '#ffffff',   
      width: 100,
      height: 100,
      borderRadius: 50,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  
});
