

import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { globalStyles } from '../../theme/global.style';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../routes/StackNavigator';



interface MenuAdministrador {
  id: number;
  title: string;
  screen: string;
  icon: string;
  color: string;
  description: string;
}
export const Administrador = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [menusAdministradores, setMenuAdministradoes] = useState<MenuAdministrador[]>([])

  const menu = [ // ← Especifica el tipo aquí también
    {
      id: 1,
      title: 'Lista Usuarios',
      screen: 'Usuarios',
      icon: 'hand-left-outline',
      color: '#3498db',
      description: 'lista de usuarios'
    },
    {
      id: 2,
      title: 'Propuestas',
      screen: 'PropuestasAdministrador',
      icon: 'list-outline',
      color: '#2ecc71',
      description: 'Lista de propuestas'
    },

  ];

  useEffect(() => {

    setMenuAdministradoes(menu);

  }, [])
  return (
   <ScrollView style={styles.container}>
         <View style={styles.header}>
           
           <Text style={styles.title}>Menu de Administracion</Text>
   
           
         </View>
   <View style={styles.menuContainer}>
           {menusAdministradores.map((item) => (
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
         </ScrollView>
  )

}

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

