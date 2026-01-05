import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from '../../../routes/StackNavigator';
import { cargarTusPropuestas } from './usepropuestas';
import { globalStylesTusPropuestas } from '../../../theme/global.style';
import { PropuestaUsuario } from '../../../interfaces/PropuestaUsuario';

export const TusPropuestas = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [cargando, setCargando] = useState(true);
  const [propuestas, setPropuestas] = useState<PropuestaUsuario[]>([]);

  // Función para cargar datos
  const cargarDatos = async () => {
    setCargando(true);
    try {
      console.log('📥 Cargando tus propuestas...');
      const datos = await cargarTusPropuestas();
      console.log('✅ Datos recibidos:', datos);
      setPropuestas(datos || []); // Asegurar que siempre sea array
    } catch (error) {
      console.error('❌ Error al cargar propuestas:', error);
      setPropuestas([]); // En caso de error, establecer array vacío
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Cargar datos al montar el componente
    cargarDatos();

    // Configurar listener para cuando la pantalla recibe foco
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 Pantalla enfocada - recargando datos');
      cargarDatos();
    });

    // Cleanup
    return unsubscribe;
  }, [navigation]);

  // Mostrar loading mientras carga
  if (cargando) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={globalStylesTusPropuestas.container}>
          <View style={globalStylesTusPropuestas.centrado}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={globalStylesTusPropuestas.textoVacio}>Cargando propuestas...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStylesTusPropuestas.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

        <View style={globalStylesTusPropuestas.header}>
          <Text style={globalStylesTusPropuestas.headerTitle}>Tus propuestas</Text>
          <Text style={globalStylesTusPropuestas.headerSubtitle}>
            {propuestas.length} propuesta{propuestas.length !== 1 ? 's' : ''} creada{propuestas.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {propuestas.length === 0 ? (
          <View style={globalStylesTusPropuestas.centrado}>
            <Icon name="document-text-outline" size={64} color="#bdc3c7" />
            <Text style={globalStylesTusPropuestas.textoVacio}>No has creado ninguna propuesta</Text>
            <Text style={globalStylesTusPropuestas.textoVacioSub}>
              Crea tu primera propuesta para comenzar
            </Text>
          </View>
        ) : (
          <ScrollView style={globalStylesTusPropuestas.listContent}>
            {propuestas.map((propuesta, index) => (
              <TouchableOpacity
                key={propuesta.idPropuesta?.toString() || `propuesta-${index}`}
                style={globalStylesTusPropuestas.item}
                onPress={() => navigation.navigate('EditarPropuesta', { 
                  idPropuesta: propuesta.idPropuesta || index, 
                  titulo: propuesta.titulo || '', 
                  descripcion: propuesta.descripcion || '',
                  presupuesto: propuesta.presupuesto , // ← Corregido
                  subencion: propuesta.subencion || propuesta.subencion || '' ,// ← Corregido
                  total:propuesta.total,
                  idConcejalia:propuesta.idConcejalia
                })}
              >
                <View style={globalStylesTusPropuestas.itemContent}>
                  <Text style={globalStylesTusPropuestas.itemTitle} numberOfLines={1}>
                    {propuesta.titulo || 'Sin título'}
                  </Text>
                  <Text style={globalStylesTusPropuestas.itemDescription} numberOfLines={2}>
                    {propuesta.descripcion || 'Sin descripción'}
                  </Text>
                  <View style={globalStylesTusPropuestas.itemFooter}>
                    <View style={globalStylesTusPropuestas.voteContainer}>
                      <Icon name="people-outline" size={14} color="#e74c3c" />
                      <Text style={globalStylesTusPropuestas.voteText}>
                        {propuesta.total ?? propuesta.total ?? 0} votos
                      </Text>
                    </View>
                    <View style={globalStylesTusPropuestas.arrowContainer}>
                      <Icon name="chevron-forward-outline" size={16} color="#bdc3c7" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        
      </SafeAreaView>
    </SafeAreaProvider>
  );
};