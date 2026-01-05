import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { RootStackParams } from '../../../routes/StackNavigator';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import { API_URL } from '@env';
import RNFS from 'react-native-fs';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

type SubirFotoRouteProp = RouteProp<RootStackParams, 'SubirFoto'>;

interface SelectedFile {
  uri: string;
  name?: string;
  type?: string;
}

const SubirFoto = () => {
  const route = useRoute<SubirFotoRouteProp>();
  const { idUsuario } = route.params || {};

  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [enviando, setEnviando] = useState(false);

  const selectFile = async () => {
    try {
      const res = await launchImageLibrary({ 
        mediaType: 'photo', 
        selectionLimit: 1,
        quality: 0.8 
      });
      
      if (res.didCancel) {
        console.log('Selección cancelada');
        return;
      }
      
      const asset = res.assets && res.assets[0];
      if (!asset?.uri) {
        Alert.alert('Error', 'No se seleccionó ninguna imagen');
        return;
      }
      
      setSelectedFile({ 
        uri: asset.uri, 
        name: asset.fileName || `foto_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg'
      });
    } catch (err) {
      console.error('Error al seleccionar imagen:', err);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const removeFile = () => setSelectedFile(null);

  const handleSubmit = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Selecciona una imagen antes de enviar');
      return;
    }

    if (!idUsuario) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }

    try {
      setEnviando(true);

      const token = await StorrageAdater.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Preparar la URI para Android si es necesario
      let uploadUri = selectedFile.uri;
      if (Platform.OS === 'android' && uploadUri.startsWith('content://')) {
        const destPath = RNFS.TemporaryDirectoryPath + '/' + (selectedFile.name || 'upload.jpg');
        await RNFS.copyFile(uploadUri, destPath);
        uploadUri = 'file://' + destPath;
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('idUsuario', String(idUsuario));
      
      // Para el campo 'idPueblo', ajusta según tus necesidades
      // Si no es necesario, puedes eliminarlo
      formData.append('idPueblo', 1);

      // Añadir el archivo de imagen
      formData.append('fotoUsuario', {
        uri: uploadUri,
        name: selectedFile.name || 'foto.jpg',
        type: selectedFile.type || 'image/jpeg',
      } as any);

      // Realizar la petición
      const response = await fetch(`${API_URL}/usuario/uploadFoto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No establecer 'Content-Type' para FormData, fetch lo hará automáticamente
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error ${response.status}`);
      }

      Alert.alert('Éxito', 'Foto subida correctamente');
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('Error al subir foto:', error);
      Alert.alert('Error', error.message || 'No se pudo subir la foto');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>
          Subir Foto de Perfil
        </Text>

        <Button
          mode="outlined"
          onPress={selectFile}
          style={styles.imagePickerButton}
          icon="image"
          disabled={enviando}
        >
          Seleccionar foto
        </Button>

        {selectedFile && (
          <View style={styles.fileInfoContainer}>
            <Image
              source={{ uri: selectedFile.uri }}
              style={styles.selectedImage}
              resizeMode="cover"
            />
            
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeFile}
              disabled={enviando}
            >
              <Icon name="close-circle" size={28} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.infoText}>
          {selectedFile 
            ? 'Selecciona otra imagen si deseas cambiarla'
            : 'Selecciona una imagen para tu perfil'
          }
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={!selectedFile || enviando}
          loading={enviando}
        >
          {enviando ? 'Enviando...' : 'Subir Foto'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default SubirFoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imagePickerButton: {
    marginVertical: 10,
    borderColor: '#4a90e2',
    borderWidth: 1,
  },
  fileInfoContainer: {
    marginTop: 15,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 2,
  },
  infoText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  submitButton: {
    paddingVertical: 6,
    backgroundColor: '#4a90e2',
  },
});