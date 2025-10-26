import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StackNavigator } from "./src/presentation/routes/StackNavigator";
import { Alert } from 'react-native';

export const App = () => {
  useEffect(() => {
    // Test simple y directo
    fetch('https://decidebustar.duckdns.org/propuestas/lista')
      .then(response => {
        if (response.ok) {
          Alert.alert('✅ Éxito', 'Conexión al servidor funcionando');
        } else {
          Alert.alert('⚠️ Advertencia', `Servidor responde con error: ${response.status}`);
        }
      })
      .catch(error => {
        Alert.alert('❌ Error', `No se puede conectar: ${error.message}`);
      });
  }, []);

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};