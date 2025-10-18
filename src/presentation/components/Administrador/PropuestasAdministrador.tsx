import React, { useEffect, useState } from 'react'
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { API_URL } from '@env';

import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { PropuestaUsuario } from '../../interfaces/PropuestaUsuario';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';



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
            // ← Guardar en estado
            console.log('User parseado:', userData);
        } else {
            console.log('No se encontró user en storage');
        }


        const result = await fetch(API_URL + '/propuestas/lista', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        )

        const users: PropuestaUsuario[] = await result.json();
        setpPropuestaUsuario(users);
    };
    // Cargar datos al montar el componente
    useEffect(() => {
        loadpropuestas();
    }, []);
    const borrarpropario = async (propuestaId: any) => {

        console.log('Este es el id del proprio',propuestaId)
    }

    const listaUsuarios=async(propuestaId: any)=>{

         navigation.navigate('ListaUsuariosporpropuesta', { idPropuesta: propuestaId})

    }

    return (
        <ScrollView style={[globalStyles.container]}>
            <View style={globalStyles.menuContainer}>
                {propuestaUsuario.map((prop) => (
                    <View key={prop.idPropuesta} style={globalStyles.cardContent}>
                        <Pressable
                            style={({ pressed }) => [
                                
                                {
                                    opacity: pressed ? 0.9 : 1,
                                    // transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                           
                        >
                            <View style={globalStyles.textContainer}>
                                <Text style={globalStyles.textContainer}>Titulo: {prop.titulo} </Text>

                                <Text style={{ flex: 1, margin: 10 }}>Propuesta: {prop.descripcion}</Text>

                                <View style={globalStyles.buttonContainer}>

                                    <Button style={globalStyles.button}
                                        onPress={() => borrarpropario(prop.idPropuesta)}>
                                        <Text style={{ borderRadius: 10, backgroundColor: '#c967b0ff', padding: 10 }}>Dar de baja   </Text>
                                    </Button>
                                    <Button style={globalStyles.button}
                                        onPress={() => listaUsuarios(prop.idPropuesta)}>
                                        <Text style={{ borderRadius: 10, backgroundColor: '#6771c9ff', padding: 10 }}>Lista de Apoyos</Text>
                                    </Button>

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
    },button:{

    },
    buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#EAB68F',
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 15,
    margin:10,
    flexDirection: 'row'
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
        margin:10
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