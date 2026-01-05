import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  TextInput  // Añadir TextInput
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from '../../../routes/StackNavigator';
import { propuestas } from '../../propuestas/propuestaResponse';
import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { User } from '../entities/user';
import { API_URL } from '@env';
import { getArchivoIcon, handleArchivoPress1,handleArchivoPress2,handleArchivoPress3,handleArchivoPress4 } from '../../propuestas/Archivos';

export const ListaPropuestas = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]); // Estado para datos filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para término de búsqueda

  // Función para cargar las propuestas
  const loadPropuestas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Buscando user en storage...');
      const userJson = await StorrageAdater.getItem('user');
      console.log('User encontrado (JSON):', userJson);

      if (userJson) {
        const userData: User = JSON.parse(userJson);
        setUsuario(userData);
        console.log('User parseado:', userData);
      } else {
        console.log('No se encontró user en storage');
      }
    } catch (error) {
      console.error('Error al obtener user:', error);
    }

    try {
      const resultado = await propuestas();
      setData(resultado);
      setFilteredData(resultado); // Inicializar filteredData con todos los datos
    } catch (err) {
      console.error('Error al cargar propuestas:', err);
      setError('No se pudieron cargar las propuestas');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar por concejalía
  const filterByConcejalia = (text: string) => {
    setSearchTerm(text);
    
    if (text.trim() === '') {
      setFilteredData(data); // Mostrar todos si no hay búsqueda
    } else {
      const filtered = data.filter(item => 
        item.nombreConcejalia?.toLowerCase().includes(text.toLowerCase()) ||
        item.nombre?.toLowerCase().includes(text.toLowerCase()) // También buscar por departamento
      );
      setFilteredData(filtered);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPropuestas();
  }, []);

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
            {filteredData.length} propuesta{filteredData.length !== 1 ? 's' : ''} encontrada{filteredData.length !== 1 ? 's' : ''}
            {searchTerm !== '' && ` (filtradas por: "${searchTerm}")`}
          </Text>
        </View>

        {/* Campo de búsqueda */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#95a5a6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por  departamento..."
            placeholderTextColor="#95a5a6"
            value={searchTerm}
            onChangeText={filterByConcejalia}
          />
          {searchTerm !== '' && (
            <TouchableOpacity onPress={() => filterByConcejalia('')}>
              <Icon name="close-circle" size={20} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Icon name="warning-outline" size={20} color="#fff" />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {filteredData.length === 0 && searchTerm !== '' ? (
            <View style={styles.noResultsContainer}>
              <Icon name="alert-circle-outline" size={50} color="#bdc3c7" />
              <Text style={styles.noResultsText}>
                No se encontraron propuestas para "{searchTerm}"
              </Text>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => filterByConcejalia('')}
              >
                <Text style={styles.clearButtonText}>Mostrar todas las propuestas</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredData.map((item) => (
              <TouchableOpacity
                key={item.idPropuesta}
                style={styles.item}
                onPress={() => navigation.navigate('ChatPropuesta', {
                  idPropuesta: item.idPropuesta,
                  idUsuario: item.idUsuario
                })}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemDescription}>Departamento: {item.nombre}</Text>
                  <Text style={styles.itemTitle}>{item.titulo}</Text>
                  
                  <ScrollView style={styles.scrollAltura} >
                    <Text style={styles.itemDescription}>{item.descripcion}</Text>
                  </ScrollView>

                  <View style={styles.itemFooter}>
                    <View style={styles.userContainer}>
                      <Icon name="person-outline" size={16} color="#3498db" />
                      <Text style={styles.userText}>Usuario {item.idUsuario}</Text>
                    </View>

                    {/* ARCHIVOS */}
                    {item.archivoRuta1 && (
                      <TouchableOpacity
                        style={styles.archivoButton}
                        onPress={() => handleArchivoPress1(item)}
                      >
                        <View style={styles.archivoContent}>
                          <Icon
                            name={getArchivoIcon(item.archivoRuta1)}
                            size={16}
                            color="#3498db"
                          />
                          <Text style={styles.archivoText}>
                            {item.archivoNombre1}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {item.archivoRuta2 && (
                      <TouchableOpacity
                        style={styles.archivoButton}
                        onPress={() => handleArchivoPress2(item)}
                      >
                        <View style={styles.archivoContent}>
                          <Icon
                            name={getArchivoIcon(item.archivoRuta2)}
                            size={16}
                            color="#3498db"
                          />
                          <Text style={styles.archivoText}>
                            {item.archivoNombre2}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {item.archivoRuta3 && (
                      <TouchableOpacity
                        style={styles.archivoButton}
                        onPress={() => handleArchivoPress3(item)}
                      >
                        <View style={styles.archivoContent}>
                          <Icon
                            name={getArchivoIcon(item.archivoRuta3)}
                            size={16}
                            color="#3498db"
                          />
                          <Text style={styles.archivoText}>
                            {item.archivoNombre3}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {item.archivoRuta4 && (
                      <TouchableOpacity
                        style={styles.archivoButton}
                        onPress={() => handleArchivoPress4(item)}
                      >
                        <View style={styles.archivoContent}>
                          <Icon
                            name={getArchivoIcon(item.archivoRuta4)}
                            size={16}
                            color="#3498db"
                          />
                          <Text style={styles.archivoText}>
                            {item.archivoNombre4}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    <Text style={styles.dateText}>
                      {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Sin fecha'}
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowContainer}>
                  <Icon name="chevron-forward" size={20} color="#95a5a6" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
  // Estilos para el buscador
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 4,
  },
  // Estilos para cuando no hay resultados
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
  },
  clearButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  concejaliaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 6,
    fontStyle: 'italic',
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
    flexWrap: 'wrap',
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
  archivoButton: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3498db',
    marginHorizontal: 4,
    marginVertical: 10
  },
  archivoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  archivoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498db',
    marginLeft: 4,
  },
});