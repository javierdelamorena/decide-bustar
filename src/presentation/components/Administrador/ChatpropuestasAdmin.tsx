import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import { StorrageAdater } from '../../../adapters/Storage-adapter';
import { RootStackParams } from '../../routes/StackNavigator';

interface Comentario {
  id: number;
  idUsuario: number;
  idPropuesta: string;
  comentario: string;
  fecha: string;
  username: string;
}

interface ComentariosPropuestas {
  idPropuesta: number;
  descripcion: string;
  titulo: string;
  fecha: string;
  idUsuario: number;
  comentarios: Comentario[];
  totales?: number;
  votoUsuario?: number;
  username: string;
}

type ChatPropuestaRouteProp = RouteProp<RootStackParams, 'ChatPropuesta'>;

export const ChatPropuestaAdmin = () => {
  const route = useRoute<ChatPropuestaRouteProp>();
  const [comentario, setComentario] = useState('');
  const [propuesta, setPropuesta] = useState<ComentariosPropuestas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const { idPropuesta } = route.params || {};

  // Cargar datos iniciales
  const cargarPropuesta = async () => {
    try {
      setCargando(true);
      const [token, userJson] = await Promise.all([
        StorrageAdater.getItem('token'),
        StorrageAdater.getItem('user')
      ]);

      if (!token || !userJson) {
        Alert.alert('Error', 'No se encontraron credenciales');
        return;
      }

      const userData = JSON.parse(userJson);
      const response = await fetch(`${API_URL}/propuestas/${idPropuesta}/${userData.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data: ComentariosPropuestas = await response.json();
      setPropuesta(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la propuesta');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPropuesta();
  }, []);

  // Manejar votos
  const handleVotar = async (voto: number) => {
    try {
      const [token, userJson] = await Promise.all([
        StorrageAdater.getItem('token'),
        StorrageAdater.getItem('user')
      ]);

      if (!token || !userJson) {
        Alert.alert('Error', 'No se encontraron credenciales');
        return;
      }

      const userData = JSON.parse(userJson);
      const response = await fetch(`${API_URL}/propuestas/votar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_Propuesta: idPropuesta,
          id_Usuario: userData.id,
          voto: voto
        })
      });

      if (!response.ok) throw new Error('Error del servidor');

      await cargarPropuesta();
      Alert.alert('Éxito', voto === 1 ? 'Voto registrado' : 'Voto eliminado');

    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el voto');
    }
  };

  // Enviar comentario
  const handleEnviarComentario = async () => {
    if (!comentario.trim() || !propuesta) return;

    try {
      setEnviando(true);
      const [token, userJson] = await Promise.all([
        StorrageAdater.getItem('token'),
        StorrageAdater.getItem('user')
      ]);

      if (!token || !userJson) throw new Error('No se encontraron credenciales');

      const userData = JSON.parse(userJson);
      const response = await fetch(`${API_URL}/comentarios`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comentario: comentario.trim(),
          idPropuesta: idPropuesta,
          idUsuario: userData.id,
          username: userData.username
        })
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const nuevoComentario: Comentario = await response.json();

      setPropuesta(prev => prev ? {
        ...prev,
        comentarios: [...prev.comentarios, nuevoComentario]
      } : null);

      setComentario('');
      Alert.alert('Éxito', 'Comentario enviado');

    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el comentario');
    } finally {
      setEnviando(false);
    }
  };

  // Borrar comentario
  const handleBorrarComentario = async (comentarioId: number) => {
    Alert.alert(
      'Eliminar Comentario',
      '¿Estás seguro de que quieres eliminar este comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await StorrageAdater.getItem('token');
              if (!token) throw new Error('No se encontró token');

              const response = await fetch(`${API_URL}/comentarios/comentarioPorId/${comentarioId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (!response.ok) throw new Error(`Error ${response.status}`);

              // Actualizar estado local
              setPropuesta(prev => prev ? {
                ...prev,
                comentarios: prev.comentarios.filter(c => c.id !== comentarioId)
              } : null);

              Alert.alert('Éxito', 'Comentario eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el comentario');
            }
          }
        }
      ]
    );
  };

  // Render de comentarios
  const renderComentario = ({ item }: { item: Comentario }) => (
    <View style={styles.comentarioContainer}>
      <View style={styles.comentarioContent}>
        <View style={styles.comentarioHeader}>
          <Text style={styles.comentarioUsuario}>{item.username}</Text>
          <TouchableOpacity 
            onPress={() => handleBorrarComentario(item.id)}
            style={styles.borrarButton}
          >
            <Icon name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <Text style={styles.comentarioTexto}>{item.comentario}</Text>
        <Text style={styles.comentarioFecha}>
          {new Date(item.fecha).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  // Estados de carga
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <Text>Cargando propuesta...</Text>
      </View>
    );
  }

  if (!propuesta) {
    return (
      <View style={styles.centrado}>
        <Text>No se pudo cargar la propuesta</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.votosTexto}>Votos: {propuesta.totales || 0}</Text>
        <Text style={styles.titulo}>{propuesta.titulo}</Text>
        <Text style={styles.descripcion}>{propuesta.descripcion}</Text>

        <View style={styles.botonesContainer}>
          {propuesta.votoUsuario === 1 ? (
            <TouchableOpacity
              style={styles.botonQuitar}
              onPress={() => handleVotar(0)}
            >
              <Icon name="heart-dislike" size={20} color="#fff" />
              <Text style={styles.botonTexto}>Quitar mi voto</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botonVotar}
              onPress={() => handleVotar(1)}
            >
              <Icon name="heart" size={20} color="#fff" />
              <Text style={styles.botonTexto}>Votar a favor</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de comentarios */}
      <View style={styles.comentariosSection}>
        <Text style={styles.comentariosTitulo}>
          Comentarios ({propuesta.comentarios.length})
        </Text>

        <FlatList
          data={propuesta.comentarios}
          renderItem={renderComentario}
          keyExtractor={item => item.id.toString()}
          style={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Input para comentar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu comentario..."
            value={comentario}
            onChangeText={setComentario}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.botonEnviar, 
              (!comentario.trim() || enviando) && styles.botonDisabled
            ]}
            onPress={handleEnviarComentario}
            disabled={!comentario.trim() || enviando}
          >
            <Icon 
              name="send" 
              size={20} 
              color={!comentario.trim() || enviando ? "#999" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  votosTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  botonesContainer: {
    alignItems: 'center',
  },
  botonVotar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  botonQuitar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  comentariosSection: {
    flex: 1,
    padding: 16,
  },
  comentariosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  lista: {
    flex: 1,
  },
  comentarioContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  comentarioContent: {
    padding: 12,
  },
  comentarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  comentarioUsuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  comentarioFecha: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  borrarButton: {
    padding: 4,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1, 
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  botonEnviar: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonDisabled: {
    backgroundColor: '#ccc',
  },
});