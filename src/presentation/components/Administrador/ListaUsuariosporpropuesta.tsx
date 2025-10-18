import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { User } from '../Usuario/entities/user';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';
import { API_URL } from '@env';
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { globalStyles } from '../../theme/global.style';


type ListaUsuariosporpropuestaProp = RouteProp<RootStackParams, 'ListaUsuariosporpropuesta'>;


const ListaUsuariosporpropuesta = () => {

    const route = useRoute<ListaUsuariosporpropuestaProp>();

    const { idPropuesta } = route.params || {};

    const [userData, setUserData] = useState<User[]>([]);

    console.log('Este es el idpropuestas que mostrar los usuarios', idPropuesta)

    const recogerUsuarios = async () => {


        const token = await StorrageAdater.getItem('token');

        


        const response = await fetch(`${API_URL}/propuestas/listaUsuarios/${idPropuesta}`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

        });
        const result = await response.json();
        setUserData(result);
        console.log("Success:", result);

        
    }
    useEffect(()=>{

            recogerUsuarios();

        },[])
    return (
       <ScrollView style={[globalStyles.container]}>
    <View style={globalStyles.menuContainer}>
        {userData.map((prop) => (
            <View key={prop.id} style={globalStyles.userCard}>
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
                        <Text style={globalStyles.userName}>{prop.username} {prop.apellidos}</Text>
                        
                        <View style={globalStyles.userInfoContainer}>
                            <View style={globalStyles.infoRow}>
                                <Text style={globalStyles.infoLabel}>Email:</Text>
                                <Text style={globalStyles.infoValue}>{prop.email}</Text>
                            </View>
                            
                            <View style={globalStyles.infoRow}>
                                <Text style={globalStyles.infoLabel}>Dirección:</Text>
                                <Text style={globalStyles.infoValue}>{prop.direccion}</Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </View>
        ))}
    </View>
</ScrollView>
    )
}

export default ListaUsuariosporpropuesta
