import React, { useState } from 'react';



import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Tablon from '../presentation/screens/Tablon';
import { Lista } from './anuncios';



const ListaAnuncios = () => {


    const [anuncios, guardarAnuncio] = useState<Lista[]>([]);
    const [tablon, setTablon] = useState(false)

    const mostrarAlerta = () => {

        Alert.alert('Algo fue mal')

    }
    const abrirTablon = () => {

        setTablon(true)

    }

    // useEffect(() => {
    const llamada = async () => {


        const url = 'https://cuevas-de-ayllon.com/listaAnuncios';

        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            const anuncio = await resultado;
            guardarAnuncio(anuncio);

        } catch (error) {

            // mostrarAlerta();
        }


    }

    if (tablon == true) {
        llamada();
    } else {
        // console.log('no hemos presionado')

    }







    return (


        <View style={styles.container}>

            <View>

                <Text style={styles.text} >Tablon de anuncios de Cuevas de ayllón</Text>
                {tablon == false ? <Button title="Acceder"
                    onPress={() => abrirTablon()}>

                </Button> : ''}
            </View>



            <View style={styles.container}>

                <ScrollView>

                    {
                        anuncios.map((listas, index) => {
                            return (

                                <Tablon
                                    key={index}
                                    id={listas.id}
                                    anuncio={listas.anuncio}
                                    titulo_anuncio={listas.titulo_anuncio}
                                    foto_anuncio={listas.foto_anuncio}
                                    fecha={listas.fecha}


                                />
                            )
                        })

                    }

                </ScrollView>
            </View >



        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        marginHorizontal: 3,
        backgroundColor: '#f0f8ff',
    }, text: {
        backgroundColor: '#e3e7e7',  // Un azul vibrante como color de fondo
        fontSize: 16,  // Hacer la fuente un poco más grande para mayor impacto
        fontWeight: 'bold',  // Mantener el texto en negrita para mayor énfasis
        color: '#373636',  // Texto en blanco para contrastar con el fondo
        paddingVertical: 15,  // Espaciado vertical generoso
        paddingHorizontal: 10,  // Espaciado horizontal para que no esté muy pegado a los bordes
        textAlign: 'center',  // Centrar el texto
        borderRadius: 2,  // Bordes redondeados para un toque moderno
        letterSpacing: 0.5,  // Un poco más de espacio entre letras para mejorar la legibilidad
        marginHorizontal: 0,  // Margen lateral para que no toque los bordes de la pantalla
        marginVertical: 15,  // Espacio vertical adicional entre la cabecera y otros elementos
        marginTop: 0,
        shadowColor: '#000',  // Sombra ligera para dar profundidad
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 1,  // Sombra para dispositivos Android
    },


})


export default ListaAnuncios