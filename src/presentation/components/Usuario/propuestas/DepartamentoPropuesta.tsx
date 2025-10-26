import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RootStackParams } from '../../../routes/StackNavigator';
import { globalStyles } from '../../../theme/global.style';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { User } from '../entities/user';

import { API_URL } from '../../../../api/tesloApi';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';

interface Concejalia { // Nombre en PascalCase
  idConcejalia: number;
  nombre: string;
}

export const DepartamentoPropuesta = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [concejalias, setConcejalias] = useState<Concejalia[]>([]); // Usando interface corregida

 

  const loadConcejalias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Buscando user en storage...');
      const userJson = await StorrageAdater.getItem('user'); // Corregido
      console.log('User encontrado (JSON):', userJson);

      if (userJson) {
        const userData: User = JSON.parse(userJson);
        const token = await StorrageAdater.getItem('token'); // Corregido
        setUsuario(userData);
        console.log('User parseado:', userData);
        
        const response = await fetch(`${API_URL}/propuestas/concejalias`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data: Concejalia[] = await response.json(); // Usando interface corregida
        setConcejalias(data);
      } else {
        console.log('No se encontró user en storage');
        setError('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar concejalías:', error);
      setError('No se pudieron cargar las concejalías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcejalias();
  }, []);

  if (loading) {
    return (
      <View style={[globalStyles.centerContainer, styles.container]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.centerContainer, styles.container]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadConcejalias}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[globalStyles.centerContainer, styles.container]}>
      <Text style={styles.welcomeText}>Elige departamento</Text>

      <View style={styles.buttonsContainer}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
        >
          {concejalias.map((item) => (
            <TouchableOpacity
              key={item.idConcejalia}
              style={styles.item}
              onPress={() => navigation.navigate('RealizarPropuesta',{ idConcejalia: item.idConcejalia ,nombre:item.nombre })} // ¿Esto es correcto?
            >
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    flex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});