import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from '../../routes/StackNavigator';

const { width } = Dimensions.get('window');

export const Usuario = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  
  const menuItems = [
    {
      id: 1,
      title: 'Realizar Propuesta',
      screen: 'RealizarPropuesta',
      icon: 'hand-left-outline',
      color: '#3498db',
      description: 'Crea una nueva propuesta para mejorar la ciudad'
    },
    {
      id: 2,
      title: 'Tus Propuestas',
      screen: 'TusPropuestas',
      icon: 'list',
      color: '#2ecc71',
      description: 'Revisa el estado de tus propuestas enviadas'
    },
    {
      id: 3,
      title: 'Lista de Propuestas',
      screen: 'ListaPropuestas',
      icon: 'list',
      color: '#9b59b6',
      description: 'Explora todas las propuestas de la comunidad'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>¡Hola Usuario!</Text>
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
            onPress={() => navigation.navigate(item.screen as keyof RootStackParams)}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={24} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              {/* <Icon name="chevron-right" size={20} color="#fff" /> */}
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Tu actividad</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Propuestas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statLabel}>Apoyos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
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
    marginBottom: 15,
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