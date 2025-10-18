import { API_URL, idPueblo } from '@env';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { User } from '../entities/user';

export const EditarUsuario = () => {
   
  const [formData, setFormData] = useState({
    username: '',
    apellidos: '',
    email: '',
    password: '',
    direccion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const cargarUsuarioStorage = async () => {
      try {
        const userJson = await StorrageAdater.getItem('user');
        if (!userJson) {
          throw new Error('No se encontraron datos de usuario');
        }

        const userData: User = JSON.parse(userJson);
        console.log('Usuario desde storage:', userData);
        setUserData(userData);
        
        // Cargar datos en el formulario
        setFormData({
          username: userData.username || '',
          apellidos: userData.apellidos || '',
          email: userData.email || '',
          password:'',
          direccion: userData.direccion || ''
        });
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
        console.error('Error cargando usuario:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    cargarUsuarioStorage();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const actualizar = async () => {
    if (!userData?.id) {
      throw new Error('No hay ID de usuario');
    }

    const token = await StorrageAdater.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_URL}/usuario/${userData.id}`;
    const data = { 
      username: formData.username, 
      apellidos: formData.apellidos, 
      email: formData.email, 
      direccion: formData.direccion, 
      password: formData.password, 
      idUsuario: userData.id,
      idPueblo:idPueblo
    };

    console.log('URL:', url);
    console.log('Datos a enviar:', data);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleUpdate = async () => {
    // Validar campos obligatorios
    const { username, apellidos, email, direccion, password } = formData;
    if (!username || !apellidos || !email || !direccion || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      await actualizar();
      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      
      // Actualizar también en storage si es necesario
      const updatedUser = { ...userData, ...formData };
      await StorrageAdater.setItem('user', JSON.stringify(updatedUser));
      
      // navigation.goBack(); // Volver a la pantalla anterior
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras carga los datos iniciales
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>Actualiza tus datos personales</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
                value={formData.username}
                onChangeText={(text) => handleChange('username', text)}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu apellido"
                placeholderTextColor="#999"
                value={formData.apellidos}
                onChangeText={(text) => handleChange('apellidos', text)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu dirección completa"
              placeholderTextColor="#999"
              value={formData.direccion}
              onChangeText={(text) => handleChange('direccion', text)}
              autoCapitalize="sentences"
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Actualizar Perfil</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  registerButton: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#8fd19e',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});