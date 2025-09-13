import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
export const CounterScreens = () => {


    const [count, setCount] = useState(10);

    const suma = () => {

        setCount(count + 1);

    }
    const resta = () => {
        setCount(count - 1);
        if (count == 0) {
            setCount(0);
        }

    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}> {count}</Text>
            {/* <PrimaryButton
                labelRestar='restar'
                labelSumar='sumar'
                onPressSuma={() => suma()}
                onPressResta={() => resta()}
                onLongPress={() => setCount(0)}


            /> */}
            <Button
                onPress={() => suma()}
                onLongPress={() => setCount(0)}
                mode='contained'
            >Suma</Button>
            <Button
                onPress={() => resta()}
                onLongPress={() => setCount(0)}
                mode='contained'
            >Resta</Button>
            {/* <Pressable style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPress
            ]} onPress={() => suma()} ><Text style={{ color: 'white' }}>sumar</Text></Pressable>
            <Pressable style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPress
            ]} onPress={() => resta()} onLongPress={() => setCount(0)} ><Text style={{ color: 'white' }}>restar</Text></Pressable> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }, title: {
        fontSize: 80,
        color: 'black',
        fontWeight: '300'
    }, button: {
        backgroundColor: '#5856D6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 10,
        borderRadius: 10,

    },
    buttonPress: {
        backgroundColor: '#444385'

    }
})
