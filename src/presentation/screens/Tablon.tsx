import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';



import {
    Image,
    Pressable,
    StyleSheet,
    Text, View
} from 'react-native';
import { Lista } from '../interfaces';





const Tablon = ({ id, anuncio, titulo_anuncio, foto_anuncio, fecha }: Lista) => {
    const [anun, setAnuncio] = useState<Lista>();

    const abrirTexto = (id: number, anuncio: string, titulo_anuncio: string, foto_anuncio: string, fecha: string) => {
        setAnuncio({ id, anuncio, titulo_anuncio, foto_anuncio, fecha });
    };
    const cerrarTexto = (id: number, anuncio: string, titulo_anuncio: string, foto_anuncio: string, fecha: string) => {
        setAnuncio({ id: 0, anuncio: '', titulo_anuncio: '', foto_anuncio: '', fecha: '' });
    };

    return (
        <>
            <View style={styles.container} key={id}>
                <Text style={styles.fecha}>Fecha:  {fecha} </Text>
                <Text style={styles.titulo}> {titulo_anuncio}</Text>
                {anuncio ? (<Text style={styles.texto}> {anuncio}</Text>) : ('')}

                <Pressable style={({ pressed }) => ({
                    ...styles.presable,
                    opacity: (pressed) ? 0.8 : 1

                })} key={id} onPress={() => abrirTexto(id, anuncio, titulo_anuncio, foto_anuncio, fecha)} onLongPress={() => { cerrarTexto(id, anuncio, titulo_anuncio, foto_anuncio, fecha) }} >
                    <View style={styles.row}>
                        <Text style={styles.textoBoton}>Ver imagen</Text>
                        <Icon style={styles.icon} name='camera-sharp' size={20} />
                    </View>
                </Pressable>


                {/* Si el anuncio tiene una imagen, la mostramos */}
                {anun && anun.foto_anuncio ? (

                    <Image
                        style={styles.imagen}
                        source={{ uri: 'https://cuevas-de-ayllon.com/uploadsAnuncios/' + anun.foto_anuncio }}
                    />
                ) : (
                    <Text>{''}</Text>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3e7e7',
        marginVertical: 10,
        marginHorizontal: 18
    }, titulo: {
        fontSize: 16, // Un poco más grande para mayor impacto
        fontWeight: '500',
        paddingBottom: 10, // Más espacio vertical
        paddingTop: 3,
        paddingHorizontal: 15, // Añadir padding horizontal
        color: '#4f814f', // Cambiar color del texto a blanco

        borderRadius: 1, // Bordes redondeados
        textAlign: 'center', // Centrar el texto
        shadowColor: '#000', // Sombra sutil
        // shadowOffset: { width: 4, height: 4 },
        // shadowOpacity: 0.6,
        // shadowRadius: 2,
        textDecorationLine: 'underline',
        // elevation: 5, // Sombra para Android
        marginVertical: 6, // Espacio entre el título y otros elementos
    },

    presable: {
        backgroundColor: '#c2d6ee',
        marginHorizontal: 2,
        marginTop: 10,
        borderRadius: 1,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',  // Para colocar los elementos en línea horizontal
        justifyContent: 'space-between',  // Para colocar el texto a la izquierda y el icono a la derecha
        alignItems: 'center',  // Alinear verticalmente ambos elementos
        paddingHorizontal: 20,  // Espaciado interno horizontal
    },
    textoBoton: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#625353', // Cambiar color del texto a blanco
    },
    icon: {
        color: '#100303',  // Icono blanco para que coincida con el texto
    },
    texto: {
        textAlign: 'left',
        fontSize: 12, // Hacer el texto un poco más grande
        lineHeight: 20, // Espaciado de líneas más agradable
        paddingVertical: 6,
        paddingHorizontal: 12, // Aumentar el padding horizontal
        color: '#262626', // Color más suave que el negro puro
        marginHorizontal: 15, // Ajustar márgenes para mayor simetría
        // backgroundColor: '#d5d0d0', // Fondo claro para resaltar el texto
        borderRadius: 3, // Bordes redondeados

        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        // elevation: 1,
    },


    imagen: {
        width: '100%',  // Hace que la imagen ocupe el ancho completo del contenedor
        height: 300,    // Ajusta la altura a un tamaño más manejable
        resizeMode: 'contain',  // Asegura que la imagen mantenga su proporción y se ajuste dentro del contenedor
        marginVertical: 10,  // Márgenes verticales
        borderRadius: 10,  // Opcional, para darle bordes redondeados
        backgroundColor: '#f0f0f0', // Color de fondo opcional para cuando no se carga la imagen
        marginBottom: 0
    },
    fecha: {
        fontSize: 12,
        textAlign: 'left',
        margin: 10

    }


})























// const styles = StyleSheet.create({
//     modal: {
//         padding: '10'
//     },

//     View: {
//         backgroundColor: 'rgba(225, 220, 235, 0.17)',

//     },
//     scrollView: {
//         backgroundColor: 'white',
//         marginHorizontal: 20,


//     },
//     button: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 5,
//         paddingHorizontal: 10,
//         borderRadius: 0,
//         elevation: 3,
//         backgroundColor: 'rgba(0, 0, 0, 0)',


//         margin: 10,


//     },
//     titulo: {

//         fontSize: 16,
//         lineHeight: 21,

//         letterSpacing: 0.25,
//         color: 'rgb(0, 178, 0)',
//         border: 'solid',
//         backgroundColor: 'white',

//         paddingHorizontal: 5
//     },
//     texto: {

//         fontSize: 16,
//         lineHeight: 21,

//         letterSpacing: 0.25,
//         color: 'white',
//         margin: 25,
//     }, container: {
//         paddingTop: 50,
//     },
//     stretch: {
//         width: 50,
//         height: 200,
//         resizeMode: 'stretch',
//     },
//     logo: {
//         width: 300,
//         height: 300,
//         alignContent: 'center',
//         marginLeft: 10
//     },
//     tinyLogo: {
//         width: 100,
//         height: 100,
//     },
// });



export default Tablon
