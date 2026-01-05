import React, { useEffect, useState } from 'react'
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { User } from '../Usuario/entities/user';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { API_URL } from '@env';



export const Usuarios = () => {

    const [usuarios, setUsuario] = useState<User[]>([]);

    const [loadin, setLoading] = useState(false);

    const [token, setToken] = useState<String | null>(null);

const loadUsuarios = async () => {

    setLoading(true);

    console.log('Buscando user en storage...');

    const userJson = await StorrageAdater.getItem('user');

    console.log('User encontrado (JSON):', userJson);

    if (!token) {
        console.log('No hay token disponible');
        setLoading(false);
        return;
    }

    console.log('Token del estado:', token);

    if (userJson) {
        const userData = JSON.parse(userJson);
        console.log('User parseado:', userData);
    } else {
        console.log('No se encontró user en storage');
    }

    try {
        const result = await fetch(API_URL + '/usuario', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // ← Usa el token del estado
                'Content-Type': 'application/json'
            }
        });

        const users: User[] = await result.json();
        setUsuario(users);
    } catch (error) {
        console.log('Error al cargar usuarios:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    const loadToken = async () => {
        const storedToken = await StorrageAdater.getItem('token');
        setToken(storedToken);
        console.log('Token cargado en estado:', storedToken);
    };
    loadToken();
}, []);

// Cargar datos cuando el token esté disponible
useEffect(() => {
    if (token) {
        console.log('Token disponible, cargando usuarios...');
        loadUsuarios();
    }
}, [token]); // ← Agrega token como dependencia

const borrarUsuario = async (usuarioId: any) => {
    if (!token) {
        console.log('No hay token disponible para borrar');
        return;
    }

    console.log('Borrando usuario con ID:', usuarioId);
    
    try {
        const result = await fetch(API_URL + `/usuario/${usuarioId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // ← Usa el token del estado
                'Content-Type': 'application/json'
            }
        });

        if (result.ok) {
            console.log('Usuario borrado exitosamente');
            loadUsuarios(); // Recargar la lista
        }
    } catch (error) {
        console.log('Error al borrar usuario:', error);
    }
};

const darPermiso = async (usuarioId: any) => {
    if (!token) {
        console.log('No hay token disponible para dar permisos');
        return;
    } 

    console.log('Dando permisos al usuario ID:', usuarioId);
    
    try {
        const result = await fetch(API_URL + `/usuario/permiso/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // ← Usa el token del estado
                'Content-Type': 'application/json'
            }
        });

        if (result.ok) {
            console.log('Permisos actualizados exitosamente');
            loadUsuarios(); // Recargar la lista
        }
    } catch (error) {
        console.log('Error al dar permisos:', error);
    }
};


    return (
        <ScrollView style={[globalStyles.container]}>
            <View style={globalStyles.menuContainer}>
                {usuarios.map((usu) => (
                    <View key={usu.id} style={globalStyles.cardContent}>
                        <Pressable
                            style={({ pressed }) => [
                                globalStyles.menuCard,
                                {
                                    opacity: pressed ? 0.9 : 1,
                                    // transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                        >
                            <View style={globalStyles.textContainer}>
                                <Text style={globalStyles.title}>Nombre: {usu.username} Apellidos: {usu.apellidos}</Text>

                                <Text style={{ flex: 1, margin: 10 }}>Email: {usu.email}</Text>
                                <Text style={{ flex: 1, fontFamily: '#666', margin: 10 }}>Direccion: {usu.direccion}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 10 }}>

                                    <Pressable style={({ pressed }) => [

                                        {
                                            flex: 1,
                                            opacity: pressed ? 0.9 : 1,
                                            transform: [{ scale: pressed ? 0.98 : 1 }]
                                        }
                                    ]}
                                        onPress={() => borrarUsuario(usu.id)}>
                                    <Text style={{ margin: 10, borderRadius: 10, backgroundColor: '#c967b0ff', padding: 10 }}>Dar de baja</Text>
                                    </Pressable>
                                    <Pressable style={({ pressed }) => [

                                        {
                                            flex: 1,
                                            opacity: pressed ? 0.9 : 1,
                                            transform: [{ scale: pressed ? 0.98 : 1 }]
                                        }
                                    ]}
                                        onPress={() => darPermiso(usu.id)}>
                                        <Text style={{ margin: 10, borderRadius: 10, backgroundColor: '#6781c9ff', padding: 10 }}>Dar permisos</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                ))
                }
            </View >
        </ScrollView >
    )
}

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    menuContainer: {
        padding: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    cardContent: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuCard: {
        borderRadius: 16,
        padding: 20,
        backgroundColor: 'white',
    },
    textContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
});