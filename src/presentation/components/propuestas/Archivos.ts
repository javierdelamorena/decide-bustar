import { API_URL } from "@env";
import { Alert, Linking } from "react-native";
import { StorrageAdater } from "../../../adapters/Storage-adapter";

export const handleArchivoPress1 = async (item: any) => {
    try {
        console.log(' Iniciando descarga de archivo...');

        const nombreArchivo = item.archivoRuta1?.split('/').pop() || item.archivoNombre1;

        console.log(' Iniciando descarga de archivo...',nombreArchivo);

        if (!nombreArchivo) {
            Alert.alert('Error', 'No se encontró nombre de archivo');
            return;
        }

        console.log('🔗 Descargando archivo:', nombreArchivo);
        const userJson = await StorrageAdater.getItem('user');

        // SOLUCIÓN SIN TOKEN: Abrir directamente en el navegador
        const url = `${API_URL}/propuestas/descargar/${encodeURIComponent(nombreArchivo)}`;

        console.log('URL completa:', url);

        // Verificar si podemos abrir la URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            // Si no se puede abrir con Linking, usar fetch y mostrar opciones
            Alert.alert(
                'Descargar archivo',
                '¿Cómo quieres descargar el archivo?',
                [
                    {
                        text: 'Abrir en navegador',
                        onPress: () => Linking.openURL(url)
                    },
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    }
                ]
            );
        }

    } catch (error) {
        console.error(' Error al descargar archivo:', error);
        Alert.alert('Error', 'No se pudo abrir el archivo');
    }
};
export const handleArchivoPress2 = async (item: any) => {
    try {
        console.log(' Iniciando descarga de archivo...');

        const nombreArchivo = item.archivoRuta2?.split('/').pop() || item.archivoNombre2;

        console.log(' Iniciando descarga de archivo...',nombreArchivo);

        if (!nombreArchivo) {
            Alert.alert('Error', 'No se encontró nombre de archivo');
            return;
        }

        console.log('🔗 Descargando archivo:', nombreArchivo);
        const userJson = await StorrageAdater.getItem('user');

        // SOLUCIÓN SIN TOKEN: Abrir directamente en el navegador
        const url = `${API_URL}/propuestas/descargar/${encodeURIComponent(nombreArchivo)}`;

        console.log('URL completa:', url);

        // Verificar si podemos abrir la URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            // Si no se puede abrir con Linking, usar fetch y mostrar opciones
            Alert.alert(
                'Descargar archivo',
                '¿Cómo quieres descargar el archivo?',
                [
                    {
                        text: 'Abrir en navegador',
                        onPress: () => Linking.openURL(url)
                    },
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    }
                ]
            );
        }

    } catch (error) {
        console.error(' Error al descargar archivo:', error);
        Alert.alert('Error', 'No se pudo abrir el archivo');
    }
};
export const handleArchivoPress3 = async (item: any) => {
    try {
        console.log(' Iniciando descarga de archivo...');

        const nombreArchivo = item.archivoRuta3?.split('/').pop() || item.archivoNombre3;

        console.log(' Iniciando descarga de archivo...',nombreArchivo);

        if (!nombreArchivo) {
            Alert.alert('Error', 'No se encontró nombre de archivo');
            return;
        }

        console.log('🔗 Descargando archivo:', nombreArchivo);
        const userJson = await StorrageAdater.getItem('user');

        // SOLUCIÓN SIN TOKEN: Abrir directamente en el navegador
        const url = `${API_URL}/propuestas/descargar/${encodeURIComponent(nombreArchivo)}`;

        console.log('URL completa:', url);

        // Verificar si podemos abrir la URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            // Si no se puede abrir con Linking, usar fetch y mostrar opciones
            Alert.alert(
                'Descargar archivo',
                '¿Cómo quieres descargar el archivo?',
                [
                    {
                        text: 'Abrir en navegador',
                        onPress: () => Linking.openURL(url)
                    },
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    }
                ]
            );
        }

    } catch (error) {
        console.error(' Error al descargar archivo:', error);
        Alert.alert('Error', 'No se pudo abrir el archivo');
    }
};
export const handleArchivoPress4 = async (item: any) => {
    try {
        console.log(' Iniciando descarga de archivo...');

        const nombreArchivo = item.archivoRuta4?.split('/').pop() || item.archivoNombre4;

        console.log(' Iniciando descarga de archivo...',nombreArchivo);

        if (!nombreArchivo) {
            Alert.alert('Error', 'No se encontró nombre de archivo');
            return;
        }

        console.log('🔗 Descargando archivo:', nombreArchivo);
        const userJson = await StorrageAdater.getItem('user');

        // SOLUCIÓN SIN TOKEN: Abrir directamente en el navegador
        const url = `${API_URL}/propuestas/descargar/${encodeURIComponent(nombreArchivo)}`;

        console.log('URL completa:', url);

        // Verificar si podemos abrir la URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            // Si no se puede abrir con Linking, usar fetch y mostrar opciones
            Alert.alert(
                'Descargar archivo',
                '¿Cómo quieres descargar el archivo?',
                [
                    {
                        text: 'Abrir en navegador',
                        onPress: () => Linking.openURL(url)
                    },
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    }
                ]
            );
        }

    } catch (error) {
        console.error(' Error al descargar archivo:', error);
        Alert.alert('Error', 'No se pudo abrir el archivo');
    }
};
export const handleArchivoPressWithFetch = async (item: any) => {
    try {
        const nombreArchivo = item.archivoRuta?.split('/').pop() || item.archivoNombre;

        if (!nombreArchivo) {
            Alert.alert('Error', 'No se encontró nombre de archivo');
            return;
        }

        const url = `${API_URL}/propuestas/descargar/${encodeURIComponent(nombreArchivo)}`;

        console.log('🔗 Descargando archivo:', url);

        // Hacer la petición SIN token
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Obtener el blob
        const blob = await response.blob();

        // Crear URL local para el blob
        const localUrl = URL.createObjectURL(blob);

        // Intentar abrir con Linking
        const supported = await Linking.canOpenURL(localUrl);

        if (supported) {
            await Linking.openURL(localUrl);
        } else {
            Alert.alert(
                'Descarga completada',
                'El archivo se ha descargado correctamente.',
                [{ text: 'OK' }]
            );
        }

    } catch (error) {
        console.error(' Error al descargar archivo:', error);
        Alert.alert('Error', 'No se pudo descargar el archivo');
    }
};

// Función para determinar el icono según el tipo de archivo
export const getArchivoIcon = (archivoRuta: string) => {
    if (!archivoRuta) return 'document-outline';

    const extension = archivoRuta.toLowerCase().split('.').pop();

    switch (extension) {
        case 'pdf':
            return 'document-text-outline';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'image-outline';
        case 'doc':
        case 'docx':
            return 'document-outline';
        case 'xls':
        case 'xlsx':
            return 'document-outline';
        default:
            return 'document-attach-outline';
    }
};

