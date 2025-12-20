import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import Tablon from './Tablon';
import { Lista } from '../../interfaces/anuncios';
import { API_URL } from '@env';
import { StorrageAdater } from '../../../adapters/Storage-adapter';

const ListaAnuncios = () => {
    const [anuncios, setAnuncios] = useState<Lista[]>([]);
    const [cargando, setCargando] = useState(true);

    const obtenerAnuncios = async () => {
        try {
            // const token = await StorrageAdater.getItem('token');

            // if (!token) {
            //     Alert.alert("Error", "No se encontró token de autenticación");
            //     return;
            // }

            const respuesta = await fetch(`${API_URL}/anuncios/listaAnuncios/1`, {
                method: 'GET',
                headers: {
                    // 'Authorization': `Bearer ${token}`,
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
                <ActivityIndicator size="large" color="#1E3A8A" />
                <Text style={styles.textoCargando}>Cargando anuncios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Cabecera institucional */}
            <View style={styles.cabecera}>
                {/* <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>BUSTARVIEJO</Text>
                    </View>
                </View> */}
                <Text style={styles.tituloPrincipal}>TABLÓN DE ANUNCIOS</Text>
                
                <View style={styles.contadorContainer}>
                    <Text style={styles.contadorTexto}>
                        {anuncios.length} anuncio{anuncios.length !== 1 ? 's' : ''} publicado{anuncios.length !== 1 ? 's' : ''}
                    </Text>
                </View>
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
                        <View style={styles.iconoContainer}>
                            <Text style={styles.icono}>📄</Text>
                        </View>
                        <Text style={styles.textoSinAnuncios}>
                            No hay anuncios publicados
                        </Text>
                        <Text style={styles.subtextoSinAnuncios}>
                            Los anuncios aparecerán aquí cuando estén disponibles
                        </Text>
                    </View>
                )}

                {/* Sello institucional al final */}
                {/* <View style={styles.pieContainer}>
                    <Text style={styles.pieTexto}>© Administración Pública</Text>
                    <Text style={styles.pieSubtexto}>Comunicación Oficial</Text>
                </View> */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centrado: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cabecera: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderBottomWidth: 4,
        borderBottomColor: '#DC2626',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 2,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logoPlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#DC2626',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E3A8A',
    },
    tituloPrincipal: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    subtitulo: {
        fontSize: 14,
        color: '#E2E8F0',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    contadorContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    contadorTexto: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    contenidoScroll: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    textoCargando: {
        marginTop: 16,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    sinAnuncios: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginVertical: 20,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconoContainer: {
        marginBottom: 20,
    },
    icono: {
        fontSize: 48,
        opacity: 0.7,
    },
    textoSinAnuncios: {
        fontSize: 18,
        color: '#1F2937',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtextoSinAnuncios: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    pieContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        marginTop: 24,
        marginBottom: 30,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    pieTexto: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    pieSubtexto: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 4,
        fontStyle: 'italic',
    },
});

export default ListaAnuncios;