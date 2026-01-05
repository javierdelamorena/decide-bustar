import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from '../../../routes/StackNavigator';
import {  propuestasVisibles } from '../../propuestas/propuestaResponse';






export const ListaPropuestasVisibles = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las propuestas
  const loadPropuestas = async () => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await propuestasVisibles();
      setData(resultado);
    } catch (err) {
      console.error('Error al cargar propuestas:', err);
      setError('No se pudieron cargar las propuestas');
      setData([]); // Limpiar datos en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  
 useEffect(() => {
    loadPropuestas();
  }, []);
  // Resto de tu componente...

  // Mostrar loading
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando propuestas...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Todas las propuestas</Text>
          <Text style={styles.headerSubtitle}>
            {data.length} propuesta{data.length !== 1 ? 's' : ''} encontrada{data.length !== 1 ? 's' : ''}
          </Text>
        </View>




        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.idPropuesta}
              style={styles.item}
            onPress={() => navigation.navigate('Login')}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.titulo}</Text>
                <ScrollView style={styles.scrollAltura} >
                                  <Text style={styles.itemDescription}>{item.descripcion}</Text>
                                </ScrollView>
                

                <View style={styles.itemFooter}>
                  <View style={styles.userContainer}>
                   
                   
                    <Text style={styles.itemDescription}>{item.nombre}</Text>
                  </View>
                  <Text style={styles.dateText}>
                    {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Sin fecha'}
                  </Text>
                </View>
              </View>

              <View style={styles.arrowContainer}>
                <Icon name="chevron-forward" size={20} color="#95a5a6" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
        onPress={() => navigation.navigate('Login')}
        >
          <Icon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorBanner: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  scrollAltura: {
    padding: 16,
    paddingBottom: 20,
    height: 100
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
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf5fb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498db',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#3498db',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});