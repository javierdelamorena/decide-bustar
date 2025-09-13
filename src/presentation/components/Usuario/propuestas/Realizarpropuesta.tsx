import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles } from '../../../theme/global.style';


export const RealizarPropuesta = () => {
 
     const [formData, setFormData] = useState({
    title: '',
    proposal: ''
  });

  const handleInputChange = (name:any, value:any) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para la propuesta');
      return;
    }

    if (!formData.proposal.trim()) {
      Alert.alert('Error', 'Por favor ingresa el contenido de la propuesta');
      return;
    }

    // Aquí puedes manejar el envío de los datos
    console.log('Datos del formulario:', formData);
    Alert.alert('Éxito', 'Propuesta enviada correctamente');
    
    // Limpiar formulario después del envío
    setFormData({
      title: '',
      proposal: ''
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crear Nueva Propuesta</Text>
        
        {/* Campo: Título de la propuesta */}
        <TextInput
          
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
         
          style={styles.input}
          maxLength={100}
          returnKeyType="next"
          placeholder="Escribe el titulo de tu propuesta aquí..."
        />

        {/* Campo: Propuesta (Text Area) */}
        <TextInput
          aria-label="Propuesta"
          value={formData.proposal}
          onChangeText={(text) => handleInputChange('proposal', text)}
          
          multiline={true}
          numberOfLines={8}
          style={[styles.input, styles.textArea]}
          textAlignVertical="top"
          maxLength={2000}
          blurOnSubmit={true}
          placeholder="Escribe tu propuesta aquí..."
        />

        {/* Contador de caracteres para la propuesta */}
        <Text style={styles.charCounter}>
          {formData.proposal.length}/2000 caracteres
        </Text>

        {/* Botón de enviar */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={globalStyles.eyeButton}
        
         
        >
          Enviar Propuesta

          
          <Icon name="send-outline" size={20} color="#95a5a6" /> 
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
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
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
});