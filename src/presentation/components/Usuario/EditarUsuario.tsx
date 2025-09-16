import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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

export const EditarUsuario = () => {
  const navigation = useNavigation();
  const [nombre, seNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const usuarioEditable = async (idUsuario:any) => {
    const url = `https://localhost:8080/usuario/${idUsuario}`;

    try {
      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }

      const resultado = await respuesta.json();
      return resultado.idUsuario;
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'Error en registro');
      throw error; // Re-throw the error to handle it in the calling function
    }
  };


  const update = async (idUsuario:any,nombre: any, apellidos: any, email: any, direccion: any) => {
    const url = `https://localhost:8080/update/${idUsuario}/${nombre}/${apellidos}/${email}/${direccion}`;

    try {
      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }

      const resultado = await respuesta.json();
      return resultado;
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'Error en registro');
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  const handleUpdate = () => {
    if (!nombre || !apellidos || !email || !direccion) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    } else {
      console.log(nombre, apellidos, email, direccion)
      Alert.alert('Éxito', 'Registro completado con éxito' + direccion);
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    // Simulación de proceso de registro
    setTimeout(() => {
      setIsLoading(false);
      update(usuarioEditable,nombre, apellidos, email, direccion);
      // Aquí iría tu lógica de registro real
      Alert.alert('Éxito', 'Registro completado con éxito');
      // navigation.navigate('Home'); // Navegar a la pantalla principal después del registro
    }, 1500);
  };

  const isValidEmail = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={seNombre}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu apellido"
                placeholderTextColor="#999"
                value={apellidos}
                onChangeText={setApellidos}
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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu dirección completa"
              placeholderTextColor="#999"
              value={direccion}
              onChangeText={setDireccion}
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
              <Text style={styles.registerButtonText}>Actualizar</Text>
            )}
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

