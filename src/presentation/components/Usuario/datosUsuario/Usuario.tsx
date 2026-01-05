import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { StorrageAdater } from '../../../../adapters/Storage-adapter';
import { User } from '../entities/user';
import { API_URL } from '@env';
import { RootStackParams } from '../../../routes/StackNavigator';
import { Image } from 'react-native-paper/lib/typescript/components/List/List';

const { width } = Dimensions.get('window');

interface InformacionUsuario {
  numPropuestas?: any;
  numVotos?: any;
  numComentarios?: any;
}

// Define la interfaz para los items del menú
interface MenuItem {
  id: number;
  title: string;
  screen: keyof RootStackParams;
  icon: string;
  color: string;
  description: string;
}

export const Usuario = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const editarFoto = (idUsuario?: any) => {
    if (!idUsuario) {
      Alert.alert('Error', 'No se pudo obtener el ID del usuario');
      return;
    }
    navigation.navigate('SubirFoto', { idUsuario });
  };

  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apoyos, setApoyos] = useState(0);
  const [implementadas, setImplementadas] = useState(0);
  const [propuestas, setPropuestas] = useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleMenuItemPress = (screen: keyof RootStackParams) => {
    if (screen === 'Departamentos') {
      // Si necesitas pasar parámetros específicos a alguna pantalla
      navigation.navigate(screen);
    } else {
      navigation.navigate(screen);
    }
  };

  useEffect(() => {
    const loadUserComentariosYTotales = async () => {
      try {
        setLoading(true);

        const userJson = await StorrageAdater.getItem('user');
        console.log('User encontrado (JSON):', userJson);

        const token = await StorrageAdater.getItem('token');

        if (!userJson || !token) {
          Alert.alert('Error', 'No se encontraron datos de usuario o token');
          setLoading(false);
          return;
        }

        const usersData: User = JSON.parse(userJson);
        setUsuario(usersData);

        const response = await fetch(`${API_URL}/usuario/informacion/${usersData.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result: InformacionUsuario = await response.json();
        console.log('InformacionUsuario', result.numVotos, result.numPropuestas, result.numComentarios);
        setApoyos(result.numVotos || 0);
        setImplementadas(result.numComentarios || 0);
        setPropuestas(result.numPropuestas || 0);

        console.log('Datos cargados:', result);

      } catch (error) {
        console.error('Error cargando información:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadUserComentariosYTotales();
    });

    // Cargar también al montar el componente
    loadUserComentariosYTotales();

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const loadUserData = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Este useEffect se ejecutará cuando "usuario" cambie
  useEffect(() => {
    console.log('Usuario actualizado:', usuario);

    const menu: MenuItem[] = [
      {
        id: 1,
        title: 'Realizar Propuesta',
        screen: 'Departamentos',
        icon: 'hand-left-outline',
        color: '#3498db',
        description: 'Crea una nueva propuesta para mejorar la ciudad'
      },
      {
        id: 2,
        title: 'Tus Propuestas',
        screen: 'TusPropuestas',
        icon: 'list-outline',
        color: '#2ecc71',
        description: 'Revisa el estado de tus propuestas enviadas'
      },
      {
        id: 3,
        title: 'Lista de Propuestas',
        screen: 'ListaPropuestas',
        icon: 'library-outline',
        color: '#9b59b6',
        description: 'Explora todas las propuestas de la comunidad'
      },
      {
        id: 4,
        title: 'Editar Usuario',
        screen: 'EditarUsuario',
        icon: 'build-outline',
        color: '#f39c12',
        description: 'Edita tus datos'
      },
      {
        id: 5,
        title: 'Darse de baja',
        screen: 'Baja',
        icon: 'trash-outline',
        color: '#e74c3c',
        description: 'Darse de baja'
      },
      {
        id: 6,
        title: 'Configuración',
        screen: 'Configuracion',
        icon: 'settings-outline',
        color: '#3498db',
        description: 'Permisos'
      }
    ];

    // Si el usuario es administrador, agregamos el item de administrador
    if (usuario?.role === 'ROLE_ADMIN') {
      const menuConAdmin: MenuItem[] = [
        ...menu,
        {
          id: 7,
          title: 'Administrador',
          screen: 'Administrador',
          icon: 'shield-checkmark-outline',
          color: '#f39c12',
          description: 'Menú de administración'
        }
      ];
      setMenuItems(menuConAdmin);
    } else {
      setMenuItems(menu);
    }

  }, [usuario]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {usuario?.fotoUsuario ? (
            <Image
              source={{ uri: usuario.fotoUsuario }} 
              style={styles.avatarImage}
            />
          ) : (
            <Icon name="person" size={40} color="#fff" />
          )}
        </View>
        <TouchableOpacity
          style={styles.editPhotoButton}
          onPress={() => editarFoto(usuario?.id)}
        >
          <Icon name="camera-outline" size={20} color="#3498db" />
          <Text style={styles.editPhotoText}>Editar foto</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>¡Hola {usuario?.username || 'Usuario'}!</Text>
        <Text style={styles.subtitle}>¿Qué te gustaría hacer hoy?</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.menuCard,
              {
                backgroundColor: item.color,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
            onPress={() => handleMenuItemPress(item.screen)}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={24} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#fff" />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Tu actividad</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{propuestas}</Text>
            <Text style={styles.statLabel}>Propuestas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{apoyos}</Text>
            <Text style={styles.statLabel}>Apoyos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{implementadas}</Text>
            <Text style={styles.statLabel}>Implementadas</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  editPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    marginBottom: 15,
  },
  editPhotoText: {
    marginLeft: 5,
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuCard: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});