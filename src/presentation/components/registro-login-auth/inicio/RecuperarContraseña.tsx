import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../../../theme/global.style';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../../routes/StackNavigator';
import { API_URL } from '@env';


export const RecuperarContraseña = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',

  });

  const handleRecupera = async () => {

    if (!form.email) {
      Alert.alert('Error', 'Por favor completa de correo si no no te podemos mandar el enlace');
      return;
    }
    if (!isValidEmail(form.email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return;
    }
    const url = `${API_URL}/auth/usuarios/recupera/${form.email}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

      },

    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    Alert.alert('Ok', 'Hemos enviado un enlace a tu correo con el que podras establecer la nueva contraseña.');
    setIsLoading(false);

    navigation.navigate('Login');

  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };



  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View style={globalStyles.logoContainer}>
          <Text style={globalStyles.title}>Recupera tu contraseña</Text>
          <Text style={globalStyles.texto}>Desde aqui puedes recuperar tu contraseña, introduce tu correo y te mandaremos un link con el que podras resetear tu contraseña.</Text>
        </View>

        <View style={globalStyles.formContainer}>
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              style={globalStyles.inputContainer}
              placeholder="Introduce tu mail"
              placeholderTextColor="#999"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>



          <TouchableOpacity
            style={[globalStyles.loginButton, isLoading && globalStyles.loginButtonDisabled]}
            onPress={handleRecupera}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.loginButtonText}>Recupera contraseña</Text>
            )}
          </TouchableOpacity>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



