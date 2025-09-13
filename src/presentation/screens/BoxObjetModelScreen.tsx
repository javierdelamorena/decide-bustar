import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const BoxObjetModelScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.pupleBox}>

                <Text>HolaMundo</Text>
            </View>
            <View style={styles.pupleBox}>


            </View>
            <View style={styles.pupleBox}>


            </View>

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,


    }, title: {
        fontSize: 40,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderWidth: 10,
    }, pupleBox: {
        height: 30,
        marginHorizontal: 20,
        marginVertical: 50,
        backgroundColor: 'purple',
        color: 'white'
    }
})
