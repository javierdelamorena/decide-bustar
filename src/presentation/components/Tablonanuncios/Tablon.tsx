import {
    Image,
    Pressable,
    StyleSheet,
    Text, 
    View
} from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Lista } from '../../interfaces';
import { API_URL } from '@env';

const Tablon = ({ id, anuncio, tituloAnuncio, fotoAnuncio, fecha }: Lista) => {
    const [anun, setAnuncio] = useState<Lista>();

    const abrirTexto = (id: number, anuncio: string, tituloAnuncio: string, fotoAnuncio: string, fecha: string) => {
        console.log('abrimos texto: ',id, anuncio, tituloAnuncio, fotoAnuncio, fecha)
         console.log('URL COMPLETA DE IMAGEN:', `${API_URL}/anuncios/descargar/${fotoAnuncio}`);
        setAnuncio({ id, anuncio, tituloAnuncio, fotoAnuncio, fecha });
    };
    
    const cerrarTexto = () => {
        setAnuncio(undefined);
    };

    const formatFecha = (fechaStr: string) => {
        const fechaObj = new Date(fechaStr);
        return fechaObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <View style={styles.container} key={id}>
            {/* Sello oficial y fecha */}
            <View style={styles.encabezado}>
                
                <Text style={styles.fecha}>{formatFecha(fecha)}</Text>
            </View>

            {/* Línea divisoria */}
            <View style={styles.lineaDivisoria} />

            {/* Título con fondo institucional */}
            <View style={styles.tituloContainer}>
                <Icon name="document-text-outline" size={20} color="#FFFFFF" style={styles.iconoTitulo} />
                <Text style={styles.titulo}>{tituloAnuncio.toUpperCase()}</Text>
            </View>

            {/* Descripción del anuncio */}
            {anuncio ? (
                <View style={styles.contenidoContainer}>
                    <Text style={styles.texto}>{anuncio}</Text>
                </View>
            ) : null}

            {/* Botón para ver imagen */}
            <Pressable 
                style={({ pressed }) => [
                    styles.botonAccion,
                    pressed && styles.botonAccionPressed
                ]} 
                onPress={() => abrirTexto(id, anuncio, tituloAnuncio, fotoAnuncio, fecha)} 
                onLongPress={cerrarTexto}
            >
                <View style={styles.botonContenido}>
                    <Icon name='image-outline' size={22} color="#FFFFFF" style={styles.iconoBoton} />
                    <Text style={styles.textoBoton}>VER IMAGEN ADJUNTA</Text>
                    <Icon name='chevron-forward-outline' size={22} color="#FFFFFF" />
                </View>
            </Pressable>

            {/* Imagen del anuncio */}
            {anun?.fotoAnuncio ? (
                <View style={styles.contenedorImagen}>
                    <View style={styles.imagenHeader}>
                        <Text style={styles.imagenTitulo}>Documento Adjunto</Text>
                        <Pressable onPress={cerrarTexto} style={styles.botonCerrar}>
                            <Icon name='close-circle-outline' size={24} color="#DC2626" />
                        </Pressable>
                    </View>
                    <Image
                        style={styles.imagen}
                        source={{ 
                            uri: `${API_URL}/anuncios/descargar/` + anun.fotoAnuncio 
                        }}
                        resizeMode="cover"
                    />
                    {/* <View style={styles.imagenFooter}>
                        <Text style={styles.imagenFooterText}>
                            Documento oficial - Administración Pública
                        </Text>
                    </View> */}
                </View>
            ) : null}

          
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginVertical: 12,
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    encabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F1F5F9',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    selloContainer: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#B91C1C',
    },
    selloText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 1,
    },
    fecha: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '500',
        fontStyle: 'italic',
    },
    lineaDivisoria: {
        height: 2,
        backgroundColor: '#1E3A8A',
        width: '100%',
    },
    tituloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3A8A',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginTop: 0,
    },
    iconoTitulo: {
        marginRight: 10,
    },
    titulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
        letterSpacing: 0.5,
        lineHeight: 22,
    },
    contenidoContainer: {
        backgroundColor: '#F8FAFC',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    texto: {
        fontSize: 14,
        lineHeight: 22,
        color: '#374151',
        textAlign: 'justify',
        letterSpacing: 0.3,
    },
    botonAccion: {
        backgroundColor: '#1E40AF',
        margin: 16,
        borderRadius: 6,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#1E3A8A',
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    botonAccionPressed: {
        backgroundColor: '#1E3A8A',
        transform: [{ scale: 0.98 }],
    },
    botonContenido: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconoBoton: {
        marginRight: 8,
    },
    textoBoton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        flex: 1,
    },
    contenedorImagen: {
        margin: 16,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    imagenHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    imagenTitulo: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    botonCerrar: {
        padding: 4,
    },
    imagen: {
        width: '100%',
        height: 280,
        backgroundColor: '#F8FAFC',
    },
    imagenFooter: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#1D4ED8',
    },
    imagenFooterText: {
        fontSize: 11,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    pieAnuncio: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    referenciaContainer: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    referenciaText: {
        fontSize: 11,
        color: '#4B5563', 
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    pieText: {
        fontSize: 11,
        color: '#6B7280',
        fontStyle: 'italic',
    },
});

export default Tablon;