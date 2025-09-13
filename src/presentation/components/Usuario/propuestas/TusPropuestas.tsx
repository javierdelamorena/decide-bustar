import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de instalar react-native-vector-icons
import { RootStackParams } from '../../../routes/StackNavigator';

const DATA = [
  {
    title: 'Propuestas de Infraestructura',
    data: [
      { id: '1', title: 'Nuevas Ciclovías', description: 'Implementación de 20km de ciclovías en el centro de la ciudad', votes: 124, date: '2023-10-15' },
      { id: '2', title: 'Renovación Parque Central', description: 'Remodelación completa del parque con áreas verdes y juegos infantiles', votes: 89, date: '2023-10-12' },
    ],
  },
  
];
export const TusPropuestas = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const renderItem = ({ item }: { item: any}) => (
      <TouchableOpacity style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          
          <View style={styles.itemFooter}>
            <View style={styles.voteContainer}>
              <Icon name="person-add-outline" size={16} color="#e74c3c" />
              <Text style={styles.voteText}>{item.votes} apoyos</Text>
            </View>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
        
        <View style={styles.arrowContainer}>
          <Icon name="eye-outline" size={20} color="#95a5a6" />
        </View>
      </TouchableOpacity>
    );
  
    const renderSectionHeader = ({ section }: { section: any }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    );
  
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tus las propuestas</Text>
            
          </View>
          
          <SectionList
            sections={DATA}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
          
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RealizarPropuesta')}>
            <Icon name="add" size={24} color="white" />
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
    sectionHeader: {
      backgroundColor: '#f8f9fa',
      paddingVertical: 12,
      marginTop: 16,
      marginBottom: 8,
    },
    sectionHeaderText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#34495e',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
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
