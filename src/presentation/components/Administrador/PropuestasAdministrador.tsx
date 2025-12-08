import React, { useEffect, useState } from 'react'
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { API_URL, idPueblo } from '@env';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { PropuestaUsuario } from '../../interfaces/PropuestaUsuario';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';
import { globalStyles } from '../../theme/global.style';

export const PropuestasAdministrador = () => {
    const [propuestaUsuario, setpPropuestaUsuario] = useState<PropuestaUsuario[]>([])
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const [loadin, setLoading] = useState(false)
    
    const loadpropuestas = async () => {
        setLoading(true);

        console.log('Buscando user en storage...');
        const userJson = await StorrageAdater.getItem('user');
        console.log('User encontrado (JSON):', userJson);

        const token = await StorrageAdater.getItem('token');
        console.log('User encontrado (JSON):', userJson);

        if (userJson) {
            const userData = JSON.parse(userJson);
        } else {
            console.log('No se encontró user en storage');
        }

        const result = await fetch(`${API_URL}/propuestas/lista/${idPueblo}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const users: PropuestaUsuario[] = await result.json();
        setpPropuestaUsuario(users);
        setLoading(false);
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        loadpropuestas();
    }, []);

    const borrarpropuesta = async (propuestaId: any) => {
        console.log('Este es el id del proprio', propuestaId)
        const token = await StorrageAdater.getItem('token');

        const result = await fetch(`${API_URL}/propuestas/${propuestaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        loadpropuestas();
    }

    const listaUsuarios = async (propuestaId: any) => {
        navigation.navigate('ListaUsuariosporpropuesta', { idPropuesta: propuestaId })
    }

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.menuContainer}>
                {propuestaUsuario.map((prop) => (
                    <View key={prop.idPropuesta} style={globalStyles.userCard}>
                        <Pressable
                            style={({ pressed }) => [
                                globalStyles.pressableCard,
                                {
                                    opacity: pressed ? 0.9 : 1,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                        >
                            <View style={globalStyles.userCardContent}>
                                <Text style={globalStyles.userName}>
                                    {prop.titulo}
                                </Text>

                                <View style={globalStyles.userInfoContainer}>
                                    <View style={globalStyles.infoRow}>
                                        <Text style={globalStyles.infoLabel}>Descripción:</Text>
                                        <Text style={globalStyles.infoValue}>{prop.descripcion}</Text>
                                    </View>
                                </View>

                                <View style={globalStyles.row}>
                                    <Button 
                                        mode="contained"
                                        onPress={() => borrarpropuesta(prop.idPropuesta)}
                                        style={[globalStyles.presable, { backgroundColor: '#e74c3c', marginRight: 10 }]}
                                        labelStyle={{ color: 'white', fontSize: 12 }}
                                    >
                                        Borrar
                                    </Button>
                                    <Button 
                                        mode="contained"
                                        onPress={() => listaUsuarios(prop.idPropuesta)}
                                        style={[globalStyles.presable, { backgroundColor: '#3498db', marginRight: 10 }]}
                                        labelStyle={{ color: 'white', fontSize: 12 }}
                                    >
                                        Apoyos
                                    </Button>
                                    <Button 
                                        mode="contained"
                                        onPress={() => navigation.navigate('ChatPropuestaAdmin', { 
                                            idPropuesta: prop.idPropuesta, 
                                            idUsuario: prop.idUsuario ,
                                           
                                        })}
                                        style={[globalStyles.presable, { backgroundColor: '#2ecc71' }]}
                                        labelStyle={{ color: 'white', fontSize: 12 }}
                                    >
                                        Chat
                                    </Button>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}