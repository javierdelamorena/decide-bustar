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

  const menu = [
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
    {
      id: 3,
      title: 'Crear Anuncio',
      screen: 'AnunciosCrear',
      icon: 'list-outline',
      color: '#ac2eccff',
      description: 'Crear anuncio Para tablon de anuncios'
    },
    {
      id: 4,
      title: 'Administrar anuncios',
      screen: 'ListaAnunciosAdministrador',
      icon: 'list-outline',
      color: '#cc752eff',
      description: 'Crear anuncio Para tablon de anuncios'
    },
  ];

  useEffect(() => {
    setMenuAdministradoes(menu);
  }, [])

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Menu de Administracion</Text>
      </View>
      
      <View style={globalStyles.menuContainer}>
        {menusAdministradores.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              globalStyles.menuCard,
              {
                backgroundColor: item.color,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
            onPress={() => navigation.navigate(item.screen as keyof RootStackParams)}
          >
            <View style={globalStyles.cardContent}>
              <View style={globalStyles.iconContainer}>
                <Icon name={item.icon} size={24} color="#fff" />
              </View>
              <View style={globalStyles.textContainer}>
                <Text style={globalStyles.menuTitle}>{item.title}</Text>
                <Text style={globalStyles.menuDescription}>{item.description}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}