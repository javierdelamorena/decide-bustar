import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from '../../../routes/StackNavigator';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { API_URL } from '@env';
import { propuestas } from '../../propuestas/propuestaResponse';
import { cargarTusPropuestas } from './usepropuestas';

interface PropuestaUsuario {
  titulo: string;
  descripcion: string; // ← Corregí el nombre
  total: number;
  idPropuesta: number;
  idUsuario: number;
}

export const TusPropuestas = () => { // ← Cambié a mayúscula
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [cargando, setCargando] = useState(true);
  const [propuestas, setPropuestas] = useState<PropuestaUsuario[]>([]); // ← Cambié a array

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Se ejecuta cuando la pantalla recibe foco
      console.log('Pantalla enfocada - recargando datos');
      cargarDatos();
    });

    // Cleanup al desmontar
    return unsubscribe;
  }, [navigation]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const datos = await cargarTusPropuestas();
      setPropuestas(datos);
    } catch (error) {
      console.error('Error al cargar:', error);
    } finally {
      setCargando(false);
    }
  };


  useEffect(() => {
    cargarDatos(); // ← Corregí el nombre
  }, []);



  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tus propuestas</Text>
          <Text style={styles.headerSubtitle}>{propuestas.length} propuestas creadas</Text>
        </View>

        {propuestas.length === 0 ? (
          <View style={styles.centrado}>
            <Icon name="document-text-outline" size={64} color="#bdc3c7" />
            <Text style={styles.textoVacio}>No has creado ninguna propuesta</Text>
            <Text style={styles.textoVacioSub}>Crea tu primera propuesta para comenzar</Text>
          </View>
        ) : (
          <ScrollView style={styles.listContent}>
            {propuestas.map((propuesta, index) => (
              <TouchableOpacity
                key={propuesta.idPropuesta || index}
                style={styles.item}
                onPress={() => navigation.navigate('EditarPropuesta', { idPropuesta: propuesta.idPropuesta || index, titulo: propuesta.titulo, descripcion: propuesta.descripcion })}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {propuesta.titulo || 'Sin título'}
                  </Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {propuesta.descripcion || 'Sin descripción'}
                  </Text>
                  <View style={styles.itemFooter}>
                    <View style={styles.voteContainer}>
                      <Icon name="people-outline" size={14} color="#e74c3c" />
                      <Text style={styles.voteText}>
                        {propuesta.total || 0} votos
                      </Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Icon name="chevron-forward-outline" size={16} color="#bdc3c7" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('RealizarPropuesta')}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoVacio: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
  },
  textoVacioSub: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 8,
    textAlign: 'center',
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
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
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffeaea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  voteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 4,
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