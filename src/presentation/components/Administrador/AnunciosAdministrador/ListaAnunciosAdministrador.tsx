import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import Tablon from './TablonAdministrador';
import { Lista } from '../../../interfaces/anuncios';
import { API_URL } from '@env';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';


const ListaAnunciosAdministrador = () => {
    const [anuncios, setAnuncios] = useState<Lista[]>([]);
    const [cargando, setCargando] = useState(true);

    const obtenerAnuncios = async () => {
        try {

            const token = await StorrageAdater.getItem('token');

            if (!token) {
                Alert.alert("Error", "No se encontró token de autenticación");
                return;
            }

            const respuesta = await fetch(`${API_URL}/anuncios/listaAnuncios/1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });



            const resultado = await respuesta.json();
            setAnuncios(resultado);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los anuncios');
            console.error('Error fetching anuncios:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerAnuncios();
    }, []);

    if (cargando) {
        return (
            <View style={[styles.container, styles.centrado]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.textoCargando}>Cargando anuncios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Cabecera */}
            <View style={styles.cabecera}>
                <Text style={styles.tituloPrincipal}>Tablón de Anuncios</Text>
                <Text style={styles.subtitulo}>
                    {anuncios.length} anuncio{anuncios.length !== 1 ? 's' : ''} disponible{anuncios.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Lista de anuncios */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contenidoScroll}
            >
                {anuncios.map((lista, index) => (
                    <Tablon
                        key={lista.id || index}
                        id={lista.id}
                        anuncio={lista.anuncio}
                        tituloAnuncio={lista.tituloAnuncio}
                        fotoAnuncio={lista.fotoAnuncio}
                        fecha={lista.fecha}
                    />
                ))}

                {/* Mensaje cuando no hay anuncios */}
                {anuncios.length === 0 && (
                    <View style={styles.sinAnuncios}>
                        <Text style={styles.textoSinAnuncios}>
                            No hay anuncios disponibles
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FDF8',
    },
    centrado: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cabecera: {
        backgroundColor: '#4CAF50',
        paddingVertical: 20,
        paddingHorizontal: 16,

        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 8,
    },
    tituloPrincipal: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitulo: {
        fontSize: 14,
        color: '#E8F5E8',
        textAlign: 'center',
        marginTop: 4,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    contenidoScroll: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    textoCargando: {
        marginTop: 12,
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '500',
    },
    sinAnuncios: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    textoSinAnuncios: {
        fontSize: 16,
        color: '#757575',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default ListaAnunciosAdministrador;