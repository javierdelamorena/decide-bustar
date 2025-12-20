import React, { useEffect, useState } from 'react'
import { Alert, PermissionsAndroid, Platform, ScrollView, Text, View } from 'react-native'
import { User } from '../Usuario/entities/user';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';
import { API_URL, idPueblo } from '@env';
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { globalStyles } from '../../theme/global.style';
import { generatePDF } from 'react-native-html-to-pdf';
import { Button } from 'react-native-paper';
import RNFS from 'react-native-fs'; // Importa react-native-fs

type ListaUsuariosporpropuestaProp = RouteProp<RootStackParams, 'ListaUsuariosporpropuesta'>;

const ListaUsuariosporpropuesta = () => {
    const route = useRoute<ListaUsuariosporpropuestaProp>();
    const { idPropuesta } = route.params || {};
    const [userData, setUserData] = useState<User[]>([]);

    // Función para solicitar permisos en Android
    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android') return true;
        
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Permiso de almacenamiento',
                    message: 'La app necesita acceso al almacenamiento para guardar el PDF',
                    buttonNeutral: 'Preguntar después',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    // Función para guardar el PDF en Downloads
    const savePdfToDownloads = async (sourcePath: string, fileName: string) => {
        try {
            // Verificar si el archivo fuente existe
            const fileExists = await RNFS.exists(sourcePath);
            if (!fileExists) {
                throw new Error('El archivo PDF generado no existe');
            }

            // Definir ruta de destino según la plataforma
            let destPath;
            if (Platform.OS === 'android') {
                // Android: Carpeta Downloads
                destPath = `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`;
                
                // Mover el archivo a Downloads
                await RNFS.moveFile(sourcePath, destPath);
            } else {
                // iOS: No hay acceso directo a Downloads
                // Guardamos en Documents y luego podemos compartir
                destPath = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;
                await RNFS.moveFile(sourcePath, destPath);
            }

            return destPath;
        } catch (error) {
            console.error('Error guardando PDF:', error);
            throw error;
        }
    };

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
                    <p><strong>Total de usuarios:</strong> ${users.length}</p>
                    <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString()}</p>
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
            // 1. Solicitar permisos en Android
            if (Platform.OS === 'android') {
                const hasPermission = await requestStoragePermission();
                if (!hasPermission) {
                    Alert.alert("Permiso denegado", "Se necesita permiso de almacenamiento para guardar el PDF");
                    return;
                }
            }

            // 2. Generar el PDF temporalmente
            const htmlContent = generarHTML(userData);
            const timestamp = new Date().getTime();
            const tempFileName = `temp_${timestamp}`;
            const finalFileName = `usuarios_propuesta_${idPropuesta}_${timestamp}`;

            let options = {
                html: htmlContent,
                fileName: tempFileName, // Nombre temporal
                directory: 'Documents', // Generar en Documents temporalmente
                base64: false,
            };

            const results = await generatePDF(options);
            
            if (!results.filePath) {
                throw new Error('No se pudo generar el archivo PDF');
            }

            // 3. Mover a Downloads (Android) o Documents (iOS)
            const finalPath = await savePdfToDownloads(results.filePath, finalFileName);

            // 4. Mostrar mensaje según plataforma
            if (Platform.OS === 'android') {
                Alert.alert(
                    "✅ PDF Guardado", 
                    `El PDF se ha guardado en la carpeta Downloads.\n\nArchivo: ${finalFileName}.pdf`,
                    [
                        { text: "Aceptar", style: "default" }
                    ]
                );
            } else {
                // iOS: Mostrar opción para compartir o abrir
                Alert.alert(
                    "✅ PDF Generado", 
                    `El PDF se ha guardado en la aplicación.\n\nPuedes abrirlo desde la app de Archivos.`,
                    [
                        { text: "Aceptar", style: "default" }
                    ]
                );
            }

            console.log("PDF guardado en:", finalPath);
            
        } catch (error) {
            console.error("Error generando PDF:", error);
            Alert.alert(
                "Error", 
                "No se pudo generar el PDF. Asegúrate de tener permisos de almacenamiento."
            );
        }
    };

    const recogerUsuarios = async () => {
        try {
            const token = await StorrageAdater.getItem('token');
            
            if (!token) {
                Alert.alert("Error", "No se encontró token de autenticación");
                return;
            }

            const response = await fetch(`${API_URL}/propuestas/listaUsuarios/${idPropuesta}/${idPueblo}`, {
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
            console.log("Usuarios obtenidos:", result.length);
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            Alert.alert("Error", "No se pudieron cargar los usuarios");
        }
    };

    useEffect(() => {
        recogerUsuarios();
    }, []);

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.menuContainer}>
                {userData.length > 0 ? (
                    <>
                        <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#f0f8ff', borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2c3e50' }}>
                                📊 Total de usuarios: {userData.length}
                            </Text>
                            <Text style={{ marginTop: 5, color: '#666' }}>
                                ID Propuesta: {idPropuesta}
                            </Text>
                        </View>
                        
                        {userData.map((prop) => (
                            <View key={prop.id} style={globalStyles.userCard}>
                                {/* ... tu código de tarjeta de usuario ... */}
                            </View>
                        ))}
                    </>
                ) : (
                    <View style={globalStyles.centerContainer}>
                        <Text style={globalStyles.infoLabel}>No hay usuarios disponibles</Text>
                    </View>
                )}
                
                {userData.length > 0 && (
                    <View style={{ marginTop: 20, marginBottom: 30 }}>
                        <Button
                            mode="contained"
                            onPress={generarPdfDeUsuarios}
                            style={[globalStyles.presable, { paddingVertical: 8 }]}
                            icon="file-pdf-box"
                            labelStyle={{ color: 'white', fontSize: 16 }}
                        >
                            Generar y Guardar PDF
                        </Button>
                        
                        <Text style={{ 
                            marginTop: 10, 
                            fontSize: 12, 
                            color: '#666', 
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            {Platform.OS === 'android' 
                                ? 'El PDF se guardará en la carpeta Downloads' 
                                : 'En iOS, el PDF se guardará dentro de la app'}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default ListaUsuariosporpropuesta;