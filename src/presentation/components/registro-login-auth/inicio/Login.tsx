import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,

  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { RootStackParams } from '../../../routes/StackNavigator';
import { useAuthStore } from '../auth/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../../theme/global.style';

export const Login = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });


  // Llama a esta función en tu app
  // testConnection();

  //  CORRECTO: Usar selector para evitar problemas de referencias
  const login = useAuthStore(state => state.login);

  const handleLogin = async () => {
    // Validación
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const wasSuccessful = await login(form.email, form.password);

      if (wasSuccessful) {
        // Alert.alert('Éxito', 'Inicio de sesión exitoso');

        navigation.navigate('Usuario')

      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al iniciar sesión');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View style={globalStyles.logoContainer}>
          <Text style={globalStyles.title}>Bienvenido</Text>
          <Text style={globalStyles.subtitle}>Inicia sesión en tu cuenta</Text>
        </View>

        <View style={globalStyles.formContainer}>
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Tu correo electronico"
              placeholderTextColor="#999"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Contraseña</Text>
            <View style={globalStyles.passwordContainer}>
              <TextInput
                style={globalStyles.passwordInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#999"
                value={form.password}
                onChangeText={(password) => setForm({ ...form, password })}
                secureTextEntry={secureTextEntry}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={toggleSecureEntry}
                style={globalStyles.eyeButton}
                disabled={isLoading}
              >
                <Text style={globalStyles.eyeText}>
                  {secureTextEntry ? 'Mostrar' : 'Ocultar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[globalStyles.loginButton, isLoading && globalStyles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={globalStyles.signupContainer}>
            <Text style={globalStyles.texto}>¿No tienes una cuenta? </Text>

          </View>
          <View style={globalStyles.signupContainer}>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={globalStyles.signupLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
          <View style={globalStyles.signupContainer}>
            <Text style={globalStyles.texto}>¿Has olvidado la contraseña? </Text>

          </View>
          <View style={globalStyles.signupContainer}>

            <TouchableOpacity onPress={() => navigation.navigate('RecuperarContraseña')}>
              <Text style={globalStyles.signupLink}>Recuperar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

