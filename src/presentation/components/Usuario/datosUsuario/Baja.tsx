import React, { useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { User } from '../entities/user';
import { API_URL } from '@env';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../../routes/StackNavigator';

export const Baja = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  // Desde tu componente React/React Native
  const eliminarUsuarioCompleto = async () => {

    const userJson = await StorrageAdater.getItem('user');
    if (!userJson) {
      throw new Error('No se encontraron datos de usuario');
    }

    const userData: User = JSON.parse(userJson);
    console.log('Usuario desde storage:', userData);


    if (!userData?.id) {
      throw new Error('No hay ID de usuario');
    }

    const token = await StorrageAdater.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    try {


      // 1. Eliminar propuestas del usuario
      await fetch(`${API_URL}/propuestas/borrarPropuestaUsuario/${userData?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // 2. Eliminar comentarios del usuario
      await fetch(`${API_URL}/comentarios/${userData?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // 3. Eliminar votos del usuario
      await fetch(`${API_URL}/propuestas/borrarVotosPorUsuario/${userData?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // 4. Finalmente eliminar el usuario
      await fetch(`${API_URL}/usuario/${userData?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      Alert.alert('Éxito', 'Usuario y todos sus datos eliminados correctamente');


    } catch (error) {
      console.error('Error eliminando usuario:', error);
      Alert.alert('Error', 'No se pudo eliminar el usuario completamente');
    }
    StorrageAdater.removeItem('user');
    StorrageAdater.removeItem('token');
    navigation.navigate('Decide_Bustar');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar usuario</Text>
          <Text style={styles.subtitle}>Edita tus Datos</Text>
        </View>

        <View style={styles.header}>

          <TouchableOpacity
            style={[styles.registerButton]}
            onPress={eliminarUsuarioCompleto}

          >

            <Text style={styles.registerButtonText}>Darse de Baja</Text>

          </TouchableOpacity>


        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Al registrarte, aceptas nuestros{' '}
            <Text style={styles.termsLink}>Términos de Servicio</Text> y{' '}
            <Text style={styles.termsLink}>Política de Privacidad</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  )
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  termsLink: {
    color: '#007AFF',
  },
});


