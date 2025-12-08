import {
    Image,
    Pressable,
    StyleSheet,
    Text, 
    View
} from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Lista } from '../../../interfaces';
import { API_URL } from '@env';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParams } from '../../../routes/StackNavigator';

const Tablon = ({ id, anuncio, titulo_anuncio, foto_anuncio, fecha }: Lista) => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const [anun, setAnuncio] = useState<Lista>();

    const abrirTexto = (id: number, anuncio: string, titulo_anuncio: string, foto_anuncio: string, fecha: string) => {
        setAnuncio({ id, anuncio, titulo_anuncio, foto_anuncio, fecha });
    };

     const borrarAnuncio = async (id: number) => {

       
                const token = await StorrageAdater.getItem('token');
        
                const result = await fetch(`${API_URL}/anuncios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                navigation.navigate('Administrador')
        
    };
    
    const cerrarTexto = () => {
        setAnuncio(undefined);
    };

    return (
        <View style={styles.container} key={id}>
            {/* Cabecera con fecha */}
            <View style={styles.cabecera}>
                <Text style={styles.fecha}>{fecha}</Text>
            </View>

            {/* Título */}
            <Text style={styles.titulo}>{titulo_anuncio}</Text>

            {/* Descripción del anuncio */}
            {anuncio ? (
                <Text style={styles.texto}>{anuncio}</Text>
            ) : null}

            {/* Botón para ver imagen */}
            <Pressable 
                style={({ pressed }) => [
                    styles.presable,
                    pressed && styles.presablePressed
                ]} 
                onPress={() => abrirTexto(id, anuncio, titulo_anuncio, foto_anuncio, fecha)} 
                onLongPress={cerrarTexto}
            >
                <View style={styles.row}>
                    <Text style={styles.textoBoton}>Ver imagen</Text>
                    <Icon name='camera-outline' size={20} color="#5D4037" />
                </View>
            </Pressable>
            <Pressable 
                style={({ pressed }) => [
                    styles.presable,
                    pressed && styles.presablePressed
                ]} 
                onPress={() => borrarAnuncio (id)} 
                onLongPress={cerrarTexto}
            >
                <View style={styles.row}>
                    <Text style={styles.textoBoton}>Borrar anuncio</Text>
                   
                </View>
            </Pressable>

            {/* Imagen del anuncio */}
            {anun?.foto_anuncio ? (
                <View style={styles.contenedorImagen}>
                    <Image
                        style={styles.imagen}
                        source={{ 
                            uri: `${API_URL}/anuncios/descargar/` + anun.foto_anuncio 
                        }}
                        resizeMode="cover"
                    />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        marginVertical: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 0,
        shadowColor: '#2e677dff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    cabecera: {
        backgroundColor: '#4c7aafff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    fecha: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
        textAlign: 'left',
    },
    titulo: {
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#2e597dff',
        textAlign: 'center',
        backgroundColor: '#E8F5E8',
        margin: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#534cafff',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    texto: {
        fontSize: 14,
        lineHeight: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: '#424242',
        textAlign: 'justify',
        backgroundColor: '#FAFAFA',
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#a5a6d6ff',
    },
    presable: {
        backgroundColor: '#4491cfff',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#81a2c7ff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    presablePressed: {
        backgroundColor: '#a5c6d6ff',
        transform: [{ scale: 0.98 }],
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    textoBoton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1aff',
        letterSpacing: 0.3,
    },
    contenedorImagen: {
        margin: 12,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#F1F8E9',
        borderWidth: 2,
        borderColor: '#d7a5e1ff',
    },
    imagen: {
        width: '100%',
        height: 250,
        backgroundColor: '#F1F8E9',
    },
});

export default Tablon;