import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { User } from '../Usuario/entities/user';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';
import { API_URL } from '@env';
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { globalStyles } from '../../theme/global.style';
import { generatePDF } from 'react-native-html-to-pdf';
import { Button } from 'react-native-paper';

type ListaUsuariosporpropuestaProp = RouteProp<RootStackParams, 'ListaUsuariosporpropuesta'>;

const ListaUsuariosporpropuesta = () => {
    const route = useRoute<ListaUsuariosporpropuestaProp>();
    const { idPropuesta } = route.params || {};
    const [userData, setUserData] = useState<User[]>([]);

    // console.log('Este es el idpropuestas que mostrar los usuarios', idPropuesta)

    const generarHTML = (users: User[]) => {
        return `
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px; 
                            line-height: 1.4;
                        }
                        h1 { 
                            color: #333; 
                            text-align: center; 
                            margin-bottom: 20px;
                        }
                        .user-card { 
                            border: 1px solid #ddd; 
                            margin: 10px 0; 
                            padding: 15px; 
                            border-radius: 5px;
                            background-color: #f9f9f9;
                        }
                        .user-name { 
                            font-size: 18px; 
                            font-weight: bold; 
                            margin-bottom: 10px;
                            color: #2c3e50;
                        }
                        .info-row { 
                            margin: 5px 0; 
                        }
                        .info-label { 
                            font-weight: bold; 
                            display: inline-block; 
                            width: 100px; 
                            color: #555;
                        }
                        .info-value { 
                            display: inline-block;
                            color: #333;
                        }
                    </style>
                </head>
                <body>
                    <h1>Lista de Usuarios - Propuesta ${idPropuesta}</h1>
                    ${users.map(user => `
                        <div class="user-card">
                            <div class="user-name">${user.username || ''} ${user.apellidos || ''}</div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${user.email || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Dirección:</span>
                                <span class="info-value">${user.direccion || 'N/A'}</span>
                            </div>
                        </div>
                    `).join('')}
                </body>
            </html>
        `;
    };

    const generarPdfDeUsuarios = async () => {
        if (userData.length === 0) {
            Alert.alert("Error", "No hay datos para generar el PDF");
            return;
        }

        try {
            const htmlContent = generarHTML(userData);

            let options = {
                html: htmlContent,
                fileName: `usuarios_propuesta_${idPropuesta}_${Date.now()}`,
                directory: 'Documents',
                base64: false,
            };

            const results = await generatePDF(options);
            console.log("PDF generado:", results.filePath);
            
            Alert.alert(
                "PDF Generado", 
                `El PDF se ha generado exitosamente.\nRuta: ${results.filePath}`
            );
        } catch (error) {
            console.error("Error generando PDF:", error);
            Alert.alert("Error", "No se pudo generar el PDF");
        }
    };

    const recogerUsuarios = async () => {
        try {
            const token = await StorrageAdater.getItem('token');
            
            if (!token) {
                Alert.alert("Error", "No se encontró token de autenticación");
                return;
            }

            const response = await fetch(`${API_URL}/propuestas/listaUsuarios/${idPropuesta}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            setUserData(result);
            console.log("Usuarios obtenidos:", result);
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            Alert.alert("Error", "No se pudieron cargar los usuarios");
        }
    };

    useEffect(() => {
        recogerUsuarios();
    }, []);

    return (
        <ScrollView style={[globalStyles.container]}>
            <View style={globalStyles.menuContainer}>
                {userData.length > 0 ? (
                    userData.map((prop) => (
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
                                    <Text style={globalStyles.userName}>
                                        {prop.username} {prop.apellidos}
                                    </Text>

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
                    ))
                ) : (
                    <Text style={globalStyles.infoLabel}>No hay usuarios disponibles</Text>
                )}
                
                <Button
                    mode="contained"
                    onPress={generarPdfDeUsuarios}
                    style={{ 
                        marginTop: 20, 
                        backgroundColor: '#6771c9',
                        borderRadius: 10
                    }}
                    labelStyle={{ color: 'white', padding: 5 }}
                >
                    Generar PDF
                </Button>
            </View>
        </ScrollView>
    )
}

export default ListaUsuariosporpropuesta;