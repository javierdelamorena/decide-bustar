import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../../../theme/global.style';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { API_URL } from '@env';

export const RealizarPropuesta = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: ''
  });
  const [enviando, setEnviando] = useState(false); // ← Estado de carga

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
  try {
    setEnviando(true);

    // 1. Obtener el usuario COMPLETO del storage
    const userJson = await StorrageAdater.getItem('user');
    
    if (!userJson) {
      throw new Error('No se encontraron datos de usuario');
    }

    // 2. Parsear el JSON a objeto
    const userData = JSON.parse(userJson);
    console.log('Usuario desde storage:', userData);

    // 3. Obtener el token por separado (como lo guardas)
    const token = await StorrageAdater.getItem('token');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    if (!userData.id) {
      throw new Error('No hay ID de usuario');
    }

    // 4. Preparar datos para enviar
    const datosCompletos = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      idUsuario: userData.id, // ← ID del objeto usuario
      username: userData.username // ← username del objeto usuario
    };

    console.log('Datos a enviar:', datosCompletos);

    // 5. Enviar a la API
    const response = await fetch(`${API_URL}/propuestas/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // ← Token del storage
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosCompletos)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    Alert.alert('Éxito', 'Propuesta creada correctamente');
    setFormData({ titulo: '', descripcion: '' });

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
        <Text style={styles.titulo}>Crear Nueva Propuesta</Text>

        <TextInput
          value={formData.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}
          style={styles.input}
          maxLength={100}
          placeholder="Título de la propuesta"
          editable={!enviando}
        />

        <TextInput
          value={formData.descripcion}
          onChangeText={(text) => handleInputChange('descripcion', text)}
          multiline={true}
          numberOfLines={8}
          style={[styles.input, styles.textArea]}
          placeholder="Describe tu propuesta..."
          editable={!enviando}
        />

        <Text style={styles.charCounter}>
          {formData.descripcion.length}/2000 caracteres
        </Text>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={globalStyles.eyeButton}
          disabled={enviando} // ← Deshabilitar durante envío
          loading={enviando} // ← Mostrar loading
              
        >
          {enviando ? 'Enviando...' : 'Enviar Propuesta'}
         
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
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
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
  charCounter: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 20,
    fontSize: 12,
  }
});