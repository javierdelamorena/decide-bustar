import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
    labelSumar: string;
    labelRestar: string;
    onPressSuma?: () => void;
    onPressResta?: () => void;
    onLongPress?: () => void;

}


export const PrimaryButton = ({ labelSumar, labelRestar, onPressResta, onPressSuma, onLongPress }: Props) => {



    return (<>
        <Pressable style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPress
        ]}
            onPress={() => onPressSuma && onPressSuma()}

        >

            <Text style={{ color: 'white' }}>{labelSumar}</Text>
        </Pressable >
        <Pressable style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPress
        ]}
            onPress={() => onPressResta && onPressResta()}
            onLongPress={() => onLongPress && onLongPress()}

        >
            <Text style={{ color: 'white' }}>{labelRestar}</Text>
        </Pressable>
    </>)
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

