import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
  ActivityIndicator,
  AppState,
  Platform,
} from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { 
  getMessaging, 
  requestPermission, 
  getToken, 
  hasPermission,
  AuthorizationStatus,
  subscribeToTopic,
  unsubscribeFromTopic,
  onMessage, //  NUEVO - Para mensajes en primer plano
  setBackgroundMessageHandler, //  NUEVO - Para mensajes en segundo plano
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces para TypeScript
interface NotificationState {
  permission: 'granted' | 'denied' | 'not-determined';
  token: string | null;
  isEnabled: boolean;
  isLoading: boolean;
}

// Tipo para el estado de autorización usando typeof AuthorizationStatus
type PermissionStatus = typeof AuthorizationStatus[keyof typeof AuthorizationStatus];

// Topics para notificaciones masivas
const NOTIFICATION_TOPICS = {
  ALL_USERS: 'all_users',
  NEWS_ALERTS: 'news_alerts',
  APP_UPDATES: 'app_updates',
  ANNOUNCEMENTS: 'announcements'
} as const;

// Inicializar Firebase Messaging con Modular API
const app = getApp();
const messaging = getMessaging(app);

export const Configuracion: React.FC = () => {
  
  const [notificationState, setNotificationState] = useState<NotificationState>({
    permission: 'not-determined',
    token: null,
    isEnabled: false,
    isLoading: false,
  });

  //  NUEVO: Manejar mensajes en primer plano
  useEffect(() => {
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      console.log(' Mensaje recibido en primer plano:', remoteMessage);
      
      // Mostrar notificación local
      Alert.alert(
        remoteMessage.notification?.title || 'Nueva notificación',
        remoteMessage.notification?.body || 'Tienes un nuevo mensaje',
        [{ text: 'OK', style: 'default' }]
      );
    });

    return unsubscribe;
  }, []);

  //  NUEVO: Configurar manejador de mensajes en segundo plano
  useEffect(() => {
    // Solo en iOS necesitas registrar el manejador de background
    if (Platform.OS === 'ios') {
      setBackgroundMessageHandler(messaging, async (remoteMessage) => {
        console.log(' Mensaje manejado en background:', remoteMessage);
        // Aquí puedes manejar la notificación cuando la app está en background
      });
    }
  }, []);

  // Cargar estado guardado y verificar permisos al montar el componente
  useEffect(() => {
    loadNotificationState();
    checkCurrentPermission();
    
    // Listener para cuando la app vuelve a primer plano (por si cambian permisos en Settings)
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      // Revisar si los permisos cambiaron mientras la app estaba en background
      checkCurrentPermission();
    }
  };

  const loadNotificationState = async (): Promise<void> => {
    try {
      const savedState = await AsyncStorage.getItem('notificationSettings');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setNotificationState(prev => ({ ...prev, ...parsedState }));
      }
    } catch (error) {
      console.error('Error loading notification state:', error);
    }
  };

  const testSubscription = async () => {
  try {
    console.log('Suscribiendo a all_users...');
    await subscribeToTopic(messaging, 'all_users');
    console.log(' Suscrito a all_users - si no hay error, está funcionando');
    
    // También suscribete a un topic de prueba único
    const uniqueTestTopic = 'test_' + Date.now();
    await subscribeToTopic(messaging, uniqueTestTopic);
    console.log(' Suscrito a topic único:', uniqueTestTopic);
    
  } catch (error) {
    console.log('Error en suscripción:', error);
  }
}
  const saveNotificationState = async (newState: Partial<NotificationState>): Promise<void> => {
    try {
      setNotificationState(prev => {
        const updatedState = { ...prev, ...newState };
        // Guardar async storage de forma asíncrona (no bloquear la UI)
        AsyncStorage.setItem('notificationSettings', JSON.stringify(updatedState));
        return updatedState;
      });
    } catch (error) {
      console.error('Error saving notification state:', error);
    }
  };

  // Suscribir usuario a todos los topics masivos
  const subscribeToAllTopics = async (): Promise<void> => {
    try {
      const topics = Object.values(NOTIFICATION_TOPICS);
      
      await Promise.all(
        topics.map(topic => subscribeToTopic(messaging, topic))
      );
      
      console.log(' Usuario suscrito a todos los topics:', topics);
    } catch (error) {
      console.error('Error suscribiendo a topics:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  };

  // Desuscribir usuario de todos los topics (al desactivar notificaciones)
  const unsubscribeFromAllTopics = async (): Promise<void> => {
    try {
      const topics = Object.values(NOTIFICATION_TOPICS);
      
      await Promise.all(
        topics.map(topic => unsubscribeFromTopic(messaging, topic))
      );
      
      console.log(' Usuario desuscrito de todos los topics');
    } catch (error) {
      console.error('Error desuscribiendo de topics:', error);
    }
  };

  // Enviar token a backend (para analytics o funcionalidades específicas)
  const sendTokenToBackend = async (token: string): Promise<void> => {
    try {
      // TODO: Implementar llamada a tu API
      console.log('📡 Enviando token al backend:', token);
      
      // Ejemplo:
      // await fetch('https://tu-api.com/users/fcm-token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + userToken,
      //   },
      //   body: JSON.stringify({
      //     fcmToken: token,
      //     platform: Platform.OS,
      //     appVersion: '1.0.0'
      //   })
      // });
      
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  const checkCurrentPermission = async (): Promise<void> => {
    try {
      // Usando Modular API: hasPermission(messaging)
      const authStatus: PermissionStatus = await hasPermission(messaging);
      
      let permission: NotificationState['permission'] = 'not-determined';
      let isEnabled = false;
      let token: string | null = null;

      switch (authStatus) {
        case AuthorizationStatus.AUTHORIZED:
        case AuthorizationStatus.PROVISIONAL:
          permission = 'granted';
          isEnabled = true;
          // Usando Modular API: getToken(messaging)
          token = await getToken(messaging);
          
          console.log(' Token FCM generado:', token);
          
          //  SUSCRIBIR A TOPICS SI YA TIENE PERMISO
          if (token && token.length > 10) {
            await subscribeToAllTopics();
            
            // OPCIONAL: Enviar token al backend
            await sendTokenToBackend(token);
            
            await saveNotificationState({ permission, isEnabled, token });
          } else {
            console.error('Token FCM inválido');
            permission = 'denied';
            isEnabled = false;
            await saveNotificationState({ permission, isEnabled });
          }
          break;
          
        case AuthorizationStatus.DENIED:
          permission = 'denied';
          isEnabled = false;
          await saveNotificationState({ permission, isEnabled });
          break;
          
        default:
          permission = 'not-determined';
          isEnabled = false;
          await saveNotificationState({ permission, isEnabled });
      }
    } catch (error) {
      console.error(' Error checking permission:', error);
    }
  };

  // FUNCIÓN AUXILIAR PARA EL PROCESO DE PERMISOS
  const proceedWithPermissionRequest = async (): Promise<void> => {
    try {
      const authStatus: PermissionStatus = await requestPermission(messaging);
      
      const enabled: boolean = 
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      let permission: NotificationState['permission'] = enabled ? 'granted' : 'denied';
      let token: string | null = null;

      if (enabled) {
        token = await getToken(messaging);
        
        if (token) {
          //  SUSCRIBIR A TOPICS MASIVOS
          await subscribeToAllTopics();
          
          //  ENVIAR TOKEN AL BACKEND (opcional, para analytics)
          await sendTokenToBackend(token);
          
          Alert.alert(
            ' Éxito', 
            'Notificaciones activadas correctamente. Recibirás alertas importantes.'
          );
          console.log('FCM Token:', token);
        } else {
          throw new Error('No se pudo generar el token FCM');
        }
      } else {
        Alert.alert(
          ' Permiso Denegado', 
          'Para recibir notificaciones, activa los permisos en Configuración → Notificaciones.'
        );
      }

      await saveNotificationState({ 
        permission, 
        isEnabled: enabled, 
        token,
        isLoading: false 
      });

    } catch (error) {
      console.error('Error en permisos:', error);
      Alert.alert(
        'Error', 
        'No se pudieron solicitar los permisos. Intenta nuevamente.'
      );
      setNotificationState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const requestNotificationPermission = async (): Promise<void> => {
    setNotificationState(prev => ({ ...prev, isLoading: true }));

    try {
      // En iOS, mostrar alerta antes de solicitar permisos
      if (Platform.OS === 'ios') {
        Alert.alert(
          'Permisos de Notificaciones',
          'Esta app quiere enviarte notificaciones para mantenerte informado. ¿Quieres permitirlo?',
          [
            {
              text: 'No permitir',
              style: 'cancel',
              onPress: () => {
                setNotificationState(prev => ({ ...prev, isLoading: false }));
              }
            },
            {
              text: 'Permitir',
              onPress: async () => {
                await proceedWithPermissionRequest();
              }
            }
          ]
        );
      } else {
        await proceedWithPermissionRequest();
      }
    } catch (error) {
      console.error('Error en solicitud de permisos:', error);
      setNotificationState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleToggleNotifications = async (value: boolean): Promise<void> => {
    if (value) {
      // Intentar activar notificaciones
      await requestNotificationPermission();
    } else {
      // Desactivar notificaciones en la app
      Alert.alert(
        'Desactivar Notificaciones',
        '¿Estás seguro de que quieres dejar de recibir notificaciones importantes? Puedes activarlas nuevamente en cualquier momento.',
        [
          { 
            text: 'Cancelar', 
            style: 'cancel',
            onPress: () => {
              // Revertir el switch a true
              setNotificationState(prev => ({ ...prev, isEnabled: true }));
            }
          },
          { 
            text: 'Desactivar', 
            style: 'destructive',
            onPress: async () => {
              //  DESUSCRIBIR DE TOPICS
              await unsubscribeFromAllTopics();
              
              await saveNotificationState({ 
                isEnabled: false,
                token: null // Limpiar token ya que no se usará
              });
              
              Alert.alert(
                'Notificaciones Desactivadas',
                'Ya no recibirás notificaciones. Puedes activarlas nuevamente cuando quieras.'
              );
            }
          }
        ]
      );
    }
  };

  const getPermissionText = (): string => {
    switch (notificationState.permission) {
      case 'granted':
        return 'Permiso concedido';
      case 'denied':
        return 'Permiso denegado';
      default:
        return 'Permiso no determinado';
    }
  };

  const getStatusColor = (): string => {
    switch (notificationState.permission) {
      case 'granted':
        return '#4CAF50'; // Verde
      case 'denied':
        return '#F44336'; // Rojo
      default:
        return '#FF9800'; // Naranja
    }
  };

  const getStatusDescription = (): string => {
    switch (notificationState.permission) {
      case 'granted':
        return 'Recibirás notificaciones importantes y actualizaciones';
      case 'denied':
        return 'Activa los permisos en configuración del sistema para recibir notificaciones';
      default:
        return 'Las notificaciones están desactivadas. Actívalas para recibir alertas importantes';
    }
  };

  const handleManualSettings = (): void => {
    Alert.alert(
      'Configuración del Sistema',
      'Para gestionar los permisos de notificaciones, ve a:\n\n' +
      'iOS: Ajustes → Tu App → Notificaciones\n' +
      'Android: Ajustes → Apps → Tu App → Notificaciones',
      [
        { text: 'Entendido', style: 'default' }
      ]
    );
  };

  //  FUNCIÓN PARA PROBAR NOTIFICACIONES MANUALMENTE
  const testNotification = async (): Promise<void> => {
    if (!notificationState.token) {
      Alert.alert('Error', 'No hay token disponible para probar');
      return;
    }

    Alert.alert(
      'Probar Notificación',
      '¿Quieres enviar una notificación de prueba?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: async () => {
            try {
              // Aquí puedes implementar el envío de una notificación de prueba
              // a través de tu backend o Firebase Console
              console.log('Token para prueba:', notificationState.token);
              Alert.alert(
                'Prueba Enviada',
                'Se ha enviado una notificación de prueba. Verifica si la recibes.'
              );
            } catch (error) {
              console.error('Error en prueba:', error);
              Alert.alert('Error', 'No se pudo enviar la prueba');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Notificaciones</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Notificaciones Push</Text>
          <Text style={styles.settingDescription}>
            {getStatusDescription()}
          </Text>
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: getStatusColor() }
              ]} 
            />
            <Text style={styles.statusText}>{getPermissionText()}</Text>
          </View>
          {notificationState.token && (
            <Text style={styles.tokenText}>
              Dispositivo registrado: {notificationState.token.substring(0, 25)}...
            </Text>
          )}
          {notificationState.permission === 'granted' && (
            <Text style={styles.topicsText}>
              Suscrito a: Alertas generales, Noticias, Actualizaciones
            </Text>
          )}
        </View>
        
        <View style={styles.switchContainer}>
          {notificationState.isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Switch
              value={notificationState.isEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationState.isEnabled ? '#007AFF' : '#f4f3f4'}
              disabled={notificationState.isLoading}
            />
          )}
        </View>
      </View>

      {notificationState.permission === 'denied' && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Para activar las notificaciones, debes permitirlos en la configuración del sistema.
          </Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleManualSettings}
          >
            <Text style={styles.settingsButtonText}>
              Abrir Configuración del Sistema
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.refreshButton]}
          onPress={checkCurrentPermission}
          disabled={notificationState.isLoading}
        >
          <Text style={styles.refreshButtonText}>
            Actualizar Estado
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.settingsButton]}
          onPress={handleManualSettings}
        >
          <Text style={styles.settingsButtonText}>
            Configuración Sistema
          </Text>
        </TouchableOpacity>

        {/*  BOTÓN NUEVO PARA PROBAR NOTIFICACIONES */}
        {notificationState.permission === 'granted' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.testButton]}
            onPress={testNotification}
          >
            <Text style={styles.testButtonText}>
              Probar Notificación
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>¿Qué notificaciones recibiré?</Text>
        <Text style={styles.infoText}>
          • Aviso de nueva propuesta{'\n'}         
          • Anuncios del tablon de anuncios{'\n'}
          • Actualizaciones y nuevas funcionalidades{'\n'}
       
        </Text>
      </View>

      {/*  NUEVO: Información de debug */}
      {/* <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Estado de Debug:</Text>
        <Text style={styles.debugText}>
          • Permisos: {notificationState.permission}{'\n'}
          • Token: {notificationState.token ? ' Generado' : 'No generado'}{'\n'}
          • Cargando: {notificationState.isLoading ? 'Sí' : 'No'}{'\n'}
          • Plataforma: {Platform.OS}
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tokenText: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  topicsText: {
    fontSize: 11,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  switchContainer: {
    justifyContent: 'center',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  refreshButton: {
    backgroundColor: '#6C757D',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  settingsButton: {
    backgroundColor: '#17A2B8',
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: '#28A745',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#17A2B8',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C5460',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#0C5460',
    lineHeight: 16,
  },
  debugContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#6C757D',
    lineHeight: 14,
    fontFamily: 'monospace',
  },
});