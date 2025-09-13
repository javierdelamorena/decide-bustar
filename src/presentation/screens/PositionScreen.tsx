import React from 'react';
import { StyleSheet, View } from 'react-native';

export const PositionScreen = () => {
    return (
        <View style={styles.container}>


            <View style={styles.orangeBox}></View>

            <View style={styles.purpleBox}></View>

            <View style={styles.greenBox}></View>



        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#28C4D9',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    purpleBox: {
        width: 100,
        height: 100,
        backgroundColor: '#5856D6',
        borderWidth: 10,
        borderColor: 'white',
        position: 'absolute',
        top: 100

    },
    greenBox: {
        width: 100,
        height: 100,
        backgroundColor: '#56d665',
        borderWidth: 10,
        borderColor: 'white',
        position: 'relative',
        top: 0

    },
    orangeBox: {
        // width: 100,
        // height: 100,
        backgroundColor: '#d66556',
        borderWidth: 10,
        borderColor: 'white',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,


    }

})
