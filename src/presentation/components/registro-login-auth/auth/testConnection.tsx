import { API_URL } from '@env';
import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';


const testConnection = async () => {
  //onst API_URL = 'https://decidebustar.duckdns.org/propuestas/lista';
  const API_UR = `${API_URL}/propuestas/lista/1`;
  
  try {
    console.log('🔄 Iniciando prueba de conexión...');
    console.log('📱 Platform:', Platform.OS);
    console.log('🔗 URL:', API_UR);

    // SOLUCIÓN: Usar Promise.race para timeout o eliminar la opción timeout
    const response = await fetch(API_UR, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // ❌ ELIMINAR: timeout: 10000, ← Esto no existe en fetch de React Native
    });

    console.log('✅ Status:', response.status);
    console.log('✅ OK?:', response.ok);
    console.log('✅ Headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('✅ Response length:', text.length);
    console.log('✅ Primeros 200 caracteres:', text.substring(0, 200));
    
    try {
      const data = JSON.parse(text);
      console.log('✅ Datos parseados correctamente');
      console.log('✅ Tipo de datos:', typeof data);
      console.log('✅ Es array?:', Array.isArray(data));
      if (Array.isArray(data)) {
        console.log('✅ Número de elementos:', data.length);
      }
      return data;
    } catch (parseError) {
      console.log('⚠️ Response no es JSON válido');
      console.log('⚠️ Parse error:', parseError);
      return text;
    }

  } catch (error) {
    console.log('❌ Error completo:', error);
    console.log('❌ Error message:', error);
    console.log('❌ Error name:', error);
    
    // Mostrar alerta en el dispositivo
    Alert.alert(
      'Error de Conexión',
      `Tipo: ${error}\nMensaje: ${error}`,
      [{ text: 'OK' }]
    );
    
    return null;
  }
};

// Usar en tu componente
export const MyComponent = () => {
  useEffect(() => {
    testConnection();
  }, []);

  return null; // o tu JSX normal
};