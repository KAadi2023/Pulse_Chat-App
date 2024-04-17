import React from 'react'
import { StyleSheet, View } from 'react-native'

const Separator = () => {
    return (
        <View style={styles.separator}>

        </View>
    )
}

const styles = StyleSheet.create({
    separator: {
        height: 0.7,
        width: '100%',
        backgroundColor: '#000000',
        opacity: 0.5
    }
})

export default Separator