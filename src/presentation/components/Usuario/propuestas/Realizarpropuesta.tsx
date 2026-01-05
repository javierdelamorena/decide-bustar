import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { globalStyles } from '../../../theme/global.style';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { API_URL, idPueblo } from '@env';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../../routes/StackNavigator';
import RNFS from 'react-native-fs';


type RealizarPropuestaRouteProp = RouteProp<RootStackParams, 'RealizarPropuesta'>;

interface FormDataFields {
  titulo: string;
  descripcion: string;
  presupuesto: string;
  subencion: string;
}

export const RealizarPropuesta = () => {
  const route = useRoute<RealizarPropuestaRouteProp>();
  const { idConcejalia, nombre } = route.params || {};

  const [selectedFile1, setSelectedFile1] = useState<DocumentPickerResponse | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<DocumentPickerResponse | null>(null);
  const [selectedFile3, setSelectedFile3] = useState<DocumentPickerResponse | null>(null);
  const [selectedFile4, setSelectedFile4] = useState<DocumentPickerResponse | null>(null);
  const [formData, setFormData] = useState<FormDataFields>({
    titulo: '',
    descripcion: '',
    presupuesto: '',
    subencion: '',
  });
  const [enviando, setEnviando] = useState(false);

  const handleInputChange = (name: keyof FormDataFields, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Selector de archivo (cualquier tipo)
  const selectFile1 = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile1(res);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Selección cancelada');
      } else {
        console.error('Error al seleccionar archivo:', err);
        Alert.alert('Error', 'No se pudo seleccionar el archivo');
      }
    }
  };
  const selectFile2 = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile2(res);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Selección cancelada');
      } else {
        console.error('Error al seleccionar archivo:', err);
        Alert.alert('Error', 'No se pudo seleccionar el archivo');
      }
    }
  };
  const selectFile3 = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile3(res);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Selección cancelada');
      } else {
        console.error('Error al seleccionar archivo:', err);
        Alert.alert('Error', 'No se pudo seleccionar el archivo');
      }
    }
  };
  const selectFile4 = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile4(res);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Selección cancelada');
      } else {
        console.error('Error al seleccionar archivo:', err);
        Alert.alert('Error', 'No se pudo seleccionar el archivo');
      }
    }
  };

  const removeFile = () => setSelectedFile1(null);

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descripcion) {
      Alert.alert('Error', 'Completa al menos el título y la descripción');
      return;
    }

    try {
      setEnviando(true);

      const userJson = await StorrageAdater.getItem('user');
      if (!userJson) throw new Error('No se encontraron datos de usuario');
      console.log('idconcejalia', idConcejalia)
      const userData = JSON.parse(userJson);
      const token = await StorrageAdater.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
      const regex = /^[0-9]+$/;
      const tieneNumeros = regex.test(formData.presupuesto);
      // ✅ Creamos FormData para incluir texto y archivo
      const dataToSend = new FormData();
      dataToSend.append('titulo', formData.titulo.trim());
      dataToSend.append('descripcion', formData.descripcion.trim());
      dataToSend.append('idUsuario', userData.id.toString());
      dataToSend.append('username', userData.username);
      dataToSend.append('idPueblo', idPueblo);
      dataToSend.append('idConcejalia', idConcejalia);
      dataToSend.append('nombre', nombre);
      dataToSend.append('presupuesto', tieneNumeros === true ? formData.presupuesto : 0);
      dataToSend.append('subencion', formData.subencion);




      if (selectedFile1?.uri) {

        const destPath = RNFS.TemporaryDirectoryPath + '/' + selectedFile1.name;

        await RNFS.copyFile(selectedFile1.uri, destPath);
        dataToSend.append('archivo1', {
          uri: 'file://' + destPath,
          name: selectedFile1.name || 'archivo1',
          type: selectedFile1.type || 'application/octet-stream',
        } as any);
        console.log('Archivo temporal creado en:', destPath);
      }
      if (selectedFile2?.uri) {

        const destPath = RNFS.TemporaryDirectoryPath + '/' + selectedFile2.name;

        await RNFS.copyFile(selectedFile2.uri, destPath);
        dataToSend.append('archivo2', {
          uri: 'file://' + destPath,
          name: selectedFile2.name || 'archivo2',
          type: selectedFile2.type || 'application/octet-stream',
        } as any);
        console.log('Archivo temporal creado en:', destPath);
      }
      if (selectedFile3?.uri) {

        const destPath = RNFS.TemporaryDirectoryPath + '/' + selectedFile3.name;

        await RNFS.copyFile(selectedFile3.uri, destPath);
        dataToSend.append('archivo3', {
          uri: 'file://' + destPath,
          name: selectedFile3.name || 'archivo3',
          type: selectedFile3.type || 'application/octet-stream',
        } as any);
        console.log('Archivo temporal creado en:', destPath);
      }
      if (selectedFile4?.uri) {

        const destPath = RNFS.TemporaryDirectoryPath + '/' + selectedFile4.name;

        await RNFS.copyFile(selectedFile4.uri, destPath);
        dataToSend.append('archivo4', {
          uri: 'file://' + destPath,
          name: selectedFile4.name || 'archivo4',
          type: selectedFile4.type || 'application/octet-stream',
        } as any);
        console.log('Archivo temporal creado en:', destPath);
      }



      const response = await fetch(`${API_URL}/propuestas/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: dataToSend,
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      Alert.alert('Éxito', 'Propuesta creada correctamente');
      setFormData({ titulo: '', descripcion: '', presupuesto: '', subencion: '' });
      setSelectedFile1(null);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo crear la propuesta');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>
          Crear una Nueva Propuesta en el departamento de:
        </Text>
        <Text style={styles.tituloDepartamento}>{nombre}</Text>

        <TextInput
          value={formData.titulo}
          onChangeText={text => handleInputChange('titulo', text)}
          style={styles.input}
          maxLength={100}
          placeholder="Título de la propuesta"
          editable={!enviando}
        />

        <TextInput
          value={formData.presupuesto}
          onChangeText={text => handleInputChange('presupuesto', text)}
          style={styles.input}
          keyboardType="numeric"
          placeholder="Presupuesto estimado..."
          editable={!enviando}
        />

        <TextInput
          value={formData.subencion}
          onChangeText={text => handleInputChange('subencion', text)}
          style={styles.input}
          placeholder="Subvención (si la hay)..."
          editable={!enviando}
        />

        <TextInput
          value={formData.descripcion}
          onChangeText={text => handleInputChange('descripcion', text)}
          multiline
          numberOfLines={8}
          maxLength={2000}
          style={[styles.input, styles.textArea]}
          placeholder="Describe tu propuesta..."
          editable={!enviando}
        />

        <Text style={styles.charCounter}>
          {formData.descripcion.length}/2000 caracteres
        </Text>

        {/* Sección archivo */}
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Archivo adjunto (opcional)</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={selectFile1}
            disabled={enviando}
          >
            <Icon name="document-attach-outline" size={24} color="#666" />
            <Text style={styles.imagePickerText}>Seleccionar archivo</Text>
          </TouchableOpacity>

          {selectedFile1 && (
            <View style={styles.fileInfoContainer}>
              {selectedFile1.type?.startsWith('image/') ? (
                <Image
                  source={{ uri: selectedFile1.uri }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.fileInfoBox}>
                  <Icon name="document-text-outline" size={30} color="#4a90e2" />
                  <Text style={styles.fileName}>{selectedFile1.name}</Text>
                  <Text style={styles.fileType}>
                    {selectedFile1.type || 'Archivo'}
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
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Archivo adjunto (opcional)</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={selectFile2}
            disabled={enviando}
          >
            <Icon name="document-attach-outline" size={24} color="#666" />
            <Text style={styles.imagePickerText}>Seleccionar archivo</Text>
          </TouchableOpacity>

          {selectedFile2 && (
            <View style={styles.fileInfoContainer}>
              {selectedFile2.type?.startsWith('image/') ? (
                <Image
                  source={{ uri: selectedFile2.uri }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.fileInfoBox}>
                  <Icon name="document-text-outline" size={30} color="#4a90e2" />
                  <Text style={styles.fileName}>{selectedFile2.name}</Text>
                  <Text style={styles.fileType}>
                    {selectedFile2.type || 'Archivo'}
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
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Archivo adjunto (opcional)</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={selectFile3}
            disabled={enviando}
          >
            <Icon name="document-attach-outline" size={24} color="#666" />
            <Text style={styles.imagePickerText}>Seleccionar archivo</Text>
          </TouchableOpacity>

          {selectedFile3 && (
            <View style={styles.fileInfoContainer}>
              {selectedFile3.type?.startsWith('image/') ? (
                <Image
                  source={{ uri: selectedFile3.uri }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.fileInfoBox}>
                  <Icon name="document-text-outline" size={30} color="#4a90e2" />
                  <Text style={styles.fileName}>{selectedFile3.name}</Text>
                  <Text style={styles.fileType}>
                    {selectedFile3.type || 'Archivo'}
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
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Archivo adjunto (opcional)</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={selectFile4}
            disabled={enviando}
          >
            <Icon name="document-attach-outline" size={24} color="#666" />
            <Text style={styles.imagePickerText}>Seleccionar archivo</Text>
          </TouchableOpacity>

          {selectedFile4 && (
            <View style={styles.fileInfoContainer}>
              {selectedFile4.type?.startsWith('image/') ? (
                <Image
                  source={{ uri: selectedFile4.uri }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.fileInfoBox}>
                  <Icon name="document-text-outline" size={30} color="#4a90e2" />
                  <Text style={styles.fileName}>{selectedFile4.name}</Text>
                  <Text style={styles.fileType}>
                    {selectedFile4.type || 'Archivo'}
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
          style={globalStyles.eyeButton}
          disabled={enviando}
          loading={enviando}
        >
          {enviando ? 'Enviando...' : 'Enviar Propuesta'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  formContainer: { padding: 20 },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  tituloDepartamento: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4a90e2',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
  },
  textArea: { height: 200, textAlignVertical: 'top' },
  charCounter: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 20,
    fontSize: 12,
  },
  imageSection: { marginBottom: 20 },
  imageLabel: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
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
  imagePickerText: { marginLeft: 10, color: '#666', fontSize: 16 },
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
  },
  fileName: { fontWeight: '600', color: '#333', marginTop: 5 },
  fileType: { fontSize: 12, color: '#666' },
  selectedImage: { width: '100%', height: 200, borderRadius: 8 },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
