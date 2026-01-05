import React, { useEffect, useState } from 'react'
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StorrageAdater } from '../../../adapters/Storage-adapter'
import { API_URL, idPueblo } from '@env'
import { PropuestaUsuario } from '../../interfaces/PropuestaUsuario'
import { RootStackParams } from '../../routes/StackNavigator'

const { width } = Dimensions.get('window')

export const PropuestasAdministrador = () => {
    const [propuestaUsuario, setpPropuestaUsuario] = useState<PropuestaUsuario[]>([])
    const navigation = useNavigation<NavigationProp<RootStackParams>>()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const loadpropuestas = async () => {
        setLoading(true)
        
        try {
            const token = await StorrageAdater.getItem('token')
            
            if (!token) {
                console.log('No se encontró token en storage')
                return
            }
            
            const result = await fetch(`${API_URL}/propuestas/lista/${idPueblo}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (!result.ok) {
                throw new Error(`Error HTTP: ${result.status}`)
            }
            
            const users: PropuestaUsuario[] = await result.json()
            setpPropuestaUsuario(users)
        } catch (error) {
            console.error('Error al cargar propuestas:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadpropuestas()
    }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        loadpropuestas()
    }

    const borrarpropuesta = async (propuestaId: any) => {
        try {
            const token = await StorrageAdater.getItem('token')
            
            const result = await fetch(`${API_URL}/propuestas/${propuestaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            if (result.ok) {
                loadpropuestas()
            } else {
                console.error('Error al borrar propuesta')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const listaUsuarios = async (propuestaId: any) => {
        navigation.navigate('ListaUsuariosporpropuesta', { idPropuesta: propuestaId })
    }

    if (loading && propuestaUsuario.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Cargando propuestas...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Gestión de Propuestas</Text>
                    <Text style={styles.headerSubtitle}>
                        {propuestaUsuario.length} propuesta{propuestaUsuario.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                
                <ScrollView 
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={true}
                    refreshControl={
                        <ScrollView
                            
                            
                        />
                    }
                >
                    {propuestaUsuario.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateTitle}>No hay propuestas</Text>
                            <Text style={styles.emptyStateText}>
                                No se han encontrado propuestas para este pueblo.
                            </Text>
                            <Button 
                                mode="contained" 
                                onPress={loadpropuestas}
                                style={styles.refreshButton}
                                icon="refresh"
                            >
                                Recargar
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.cardsContainer}>
                            {propuestaUsuario.map((prop) => (
                                <View key={prop.idPropuesta} style={styles.card}>
                                    {/* Encabezado de la tarjeta */}
                                    <View style={styles.cardHeader}>
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.cardTitle} numberOfLines={2}>
                                                {prop.titulo}
                                            </Text>
                                            
                                        </View>
                                        
                                        
                                    </View>
                                    
                                    {/* Descripción con scroll */}
                                    <View style={styles.descriptionSection}>
                                        <Text style={styles.sectionLabel}>DESCRIPCIÓN</Text>
                                        <View style={styles.descriptionContainer}>
                                            <ScrollView 
                                                style={styles.descriptionScroll}
                                                showsVerticalScrollIndicator={true}
                                                nestedScrollEnabled={true}
                                            >
                                                <Text style={styles.descriptionText}>
                                                    {prop.descripcion|| 'Sin descripción disponible'}
                                                </Text>
                                            </ScrollView>
                                        </View>
                                    </View>
                                    
                                    {/* Información adicional */}
                                    <View style={styles.metaInfo}>
                                        {prop.idUsuario && (
                                            <View style={styles.metaItem}>
                                                <Text style={styles.metaLabel}>ID Usuario:</Text>
                                                <Text style={styles.metaValue}>{prop.idUsuario}</Text>
                                            </View>
                                        )}
                                        {prop.idPropuesta && (
                                            <View style={styles.metaItem}>
                                                <Text style={styles.metaLabel}>ID Propuesta:</Text>
                                                <Text style={styles.metaValue}>{prop.idPropuesta}</Text>
                                            </View>
                                        )}
                                    </View>
                                    
                                    {/* Botones de acción */}
                                    <View style={styles.actionsContainer}>
                                        <Button
                                            mode="outlined"
                                            onPress={() => borrarpropuesta(prop.idPropuesta)}
                                            style={[styles.actionButton, styles.deleteButton]}
                                            labelStyle={styles.deleteButtonLabel}
                                            icon="delete"
                                            compact
                                        >
                                            Eliminar
                                        </Button>
                                        
                                        <Button
                                            mode="outlined"
                                            onPress={() => listaUsuarios(prop.idPropuesta)}
                                            style={[styles.actionButton, styles.supportButton]}
                                            labelStyle={styles.supportButtonLabel}
                                            icon="account-group"
                                            compact
                                        >
                                            Apoyos
                                        </Button>
                                        
                                        <Button
                                            mode="contained"
                                            onPress={() => navigation.navigate('ChatPropuestaAdmin', {
                                                idPropuesta: prop.idPropuesta,
                                                idUsuario: prop.idUsuario,
                                            })}
                                            style={[styles.actionButton, styles.chatButton]}
                                            labelStyle={styles.chatButtonLabel}
                                            icon="message-text"
                                            compact
                                        >
                                            Chat
                                        </Button>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                    
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#7f8c8d',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    scrollContainer: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    refreshButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    cardsContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        lineHeight: 24,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 13,
        color: '#95a5a6',
    },
    statusBadge: {
        backgroundColor: '#e8f4fc',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2980b9',
        textTransform: 'uppercase',
    },
    descriptionSection: {
        padding: 16,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    descriptionContainer: {
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
    minHeight: 100,  // Altura mínima para que se vea incluso si el texto es corto
    maxHeight: 120,
    overflow: 'hidden',
},
descriptionScroll: {
    flex: 1,
},
    descriptionText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#34495e',
        padding: 12,
    },
    metaInfo: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
    metaItem: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        flex: 1,
    },
    metaLabel: {
        fontSize: 11,
        color: '#95a5a6',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 13,
        color: '#2c3e50',
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        gap: 8,
    },
    actionButton: {
        borderRadius: 6,
        minWidth: 100,
    },
    deleteButton: {
        borderColor: '#e74c3c',
    },
    deleteButtonLabel: {
        fontSize: 13,
        color: '#e74c3c',
        fontWeight: '600',
    },
    supportButton: {
        borderColor: '#3498db',
    },
    supportButtonLabel: {
        fontSize: 13,
        color: '#3498db',
        fontWeight: '600',
    },
    chatButton: {
        backgroundColor: '#2ecc71',
    },
    chatButtonLabel: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 20,
    },
})

export default PropuestasAdministrador