import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import RNFS from 'react-native-fs';
import { API_URL, idPueblo } from '@env';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { RootStackParams } from '../../../routes/StackNavigator';

// Definir el tipo para los parámetros de la ruta


interface FormDataFields {
  anuncio: string;
  titulo_anuncio: string;
  nombre: string;
  ruta: string;

}

export const AnunciosCrear = () => {




  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const [formData, setFormData] = useState<FormDataFields>({
    anuncio: '',
    titulo_anuncio: '',
    nombre: '',
    ruta: ''

  });
  const [enviando, setEnviando] = useState(false);

  const handleInputChange = (name: keyof FormDataFields, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Selector de archivo
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile(res);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Selección cancelada');
      } else {
        console.error('Error al seleccionar archivo:', err);
        Alert.alert('Error', 'No se pudo seleccionar el archivo');
      }
    }
  };

  const removeFile = () => setSelectedFile(null);

  const handleSubmit = async () => {
    if (!formData.anuncio || !formData.titulo_anuncio) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    try {
      setEnviando(true);

      const userJson = await StorrageAdater.getItem('user');
      if (!userJson) throw new Error('No se encontraron datos de usuario');

      const userData = JSON.parse(userJson);
      const token = await StorrageAdater.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      // Creamos FormData para incluir texto y archivo
      const dataToSend = new FormData();
      
      dataToSend.append('tituloAnuncio', formData.titulo_anuncio.trim());
      dataToSend.append('anuncio', formData.anuncio.trim());
      dataToSend.append('idPueblo', 1);



      // Asegúrate de tener idPueblo disponible (puede venir de route.params o userData)
      const puebloId = idPueblo;
      if (puebloId) {
        dataToSend.append('idPueblo', puebloId.toString());
      }

      // URL opcional si la tienes


      if (selectedFile?.uri) {
        const destPath = RNFS.TemporaryDirectoryPath + '/' + selectedFile.name;
        await RNFS.copyFile(selectedFile.uri, destPath);
        dataToSend.append('archivo', {
          uri: 'file://' + destPath,
          name: selectedFile.name || 'archivo',
          type: selectedFile.type || 'application/octet-stream',
        } as any);
        console.log('Archivo temporal creado en:', destPath);
      }

      // Cambiar la URL al endpoint de anuncios
      const response = await fetch(`${API_URL}/anuncios/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      Alert.alert('Éxito', 'Anuncio creado correctamente');
      setFormData({ anuncio: '', titulo_anuncio: '',nombre:'',ruta:'' });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo crear el anuncio');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>
          Crear un Nuevo Anuncio
        </Text>

        <TextInput
          value={formData.titulo_anuncio}
          onChangeText={text => handleInputChange('titulo_anuncio', text)}
          style={styles.input}
          maxLength={100}
          placeholder="Título del anuncio"
          editable={!enviando}
        />

        <TextInput
          value={formData.anuncio}
          onChangeText={text => handleInputChange('anuncio', text)}
          multiline
          numberOfLines={8}
          maxLength={2000}
          style={[styles.input, styles.textArea]}
          placeholder="Descripción del anuncio..."
          editable={!enviando}
        />

        <Text style={styles.charCounter}>
          {formData.titulo_anuncio.length}/2000 caracteres
        </Text>

        {/* Sección archivo */}
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Archivo adjunto (opcional)</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={selectFile}
            disabled={enviando}
          >
            <Icon name="document-attach-outline" size={24} color="#666" />
            <Text style={styles.imagePickerText}>Seleccionar archivo</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileInfoContainer}>
              {selectedFile.type?.startsWith('image/') ? (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.fileInfoBox}>
                  <Icon name="document-text-outline" size={30} color="#4a90e2" />
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <Text style={styles.fileType}>
                    {selectedFile.type || 'Archivo'}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeFile}
                disabled={enviando}
              >
                <Icon name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={enviando}
          loading={enviando}
        >
          {enviando ? 'Enviando...' : 'Crear Anuncio'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  formContainer: {
    padding: 20
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top'
  },
  charCounter: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 20,
    fontSize: 12,
  },
  imageSection: {
    marginBottom: 20
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16
  },
  fileInfoContainer: {
    marginTop: 15,
    position: 'relative',
    alignItems: 'center',
  },
  fileInfoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileName: {
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
    textAlign: 'center'
  },
  fileType: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#4a90e2',
  },
});

// No olvides agregar la ruta en tu Stack Navigator si no lo has hecho:
/*
<Stack.Screen name="Anuncios" component={Anuncios} />
*/

// Y en tu RootStackParams:
/*
export type RootStackParams = {
  // ... tus otras rutas
  Anuncios: { idPueblo?: number }; // o los parámetros que necesites
}
*/