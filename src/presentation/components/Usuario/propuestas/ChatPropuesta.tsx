import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParams } from '../../../routes/StackNavigator';

// Tipos TypeScript (ajustar según API Spring)
type Comentario = {
  id: number;
  idUsuario: number;
  usuarioNombre: string;
  texto: string;
  fecha: string;
};

type Propuesta = {
  idPropuesta: number;
  titulo: string;
  descripcion: string;
  votosAFavor: number;
  votosEnContra: number;
  usuarioVoto: 'a-favor' | 'en-contra' | null;
  comentarios: Comentario[];
};

type ChatPropuestaRouteProp = RouteProp<RootStackParams, 'ChatPropuesta'>;

export const ChatPropuesta = () => {
  const route = useRoute<ChatPropuestaRouteProp>();
  const [comentario, setComentario] = useState('');
  const [propuesta, setPropuesta] = useState<Propuesta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Datos que vendrán de la navegación (ajustar según API)
  const { idPropuesta, titulo, idUsuario } = route.params || {
    idPropuesta: 0,
    titulo: 'Propuesta',
    idUsuario: 0
  };

  // SIMULAR: Cargar propuesta desde API Spring
  useEffect(() => {
    const cargarPropuesta = async () => {
      try {
        setCargando(true);
        
        // TODO: Reemplazar con llamada real a API Spring
        // const response = await fetch(`http://tu-api.com/propuestas/${idPropuesta}`);
        // const data = await response.json();
        // setPropuesta(data);
        
        // Datos de simulación
        setTimeout(() => {
          setPropuesta({
            idPropuesta,
            titulo,
            descripcion: 'Descripción de la propuesta que vendrá de la API...',
            votosAFavor: 124,
            votosEnContra: 23,
            usuarioVoto: null,
            comentarios: [
              {
                id: 1,
                idUsuario: 2,
                usuarioNombre: 'Usuario Ejemplo',
                texto: 'Este es un comentario de ejemplo que vendrá de la API',
                fecha: '2023-10-15 14:30'
              }
            ]
          });
          setCargando(false);
        }, 1000);
        
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la propuesta');
        setCargando(false);
      }
    };

    cargarPropuesta();
  }, [idPropuesta]);

  // SIMULAR: Votar propuesta
  const handleVotar = async (tipoVoto: 'a-favor' | 'en-contra') => {
  if (!propuesta) return;

  try {
    // 1. Optimistic UI update - asumimos que el backend responderá correctamente
    const votoAnterior = propuesta.usuarioVoto;
    const nuevoVoto = votoAnterior === tipoVoto ? null : tipoVoto;
    
    setPropuesta(prev => prev ? {
      ...prev,
      usuarioVoto: nuevoVoto,
      // Los votos totales los actualizará el backend en la siguiente carga
    } : prev);

    // 2. Llamar al backend - él se encarga de toda la lógica
    const response = await fetch(`http://tu-api.com/propuestas/${idPropuesta}/voto`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer tu-token' // Si usas autenticación
      },
      body: JSON.stringify({ 
        idUsuario, 
        tipoVoto: nuevoVoto // Enviamos el nuevo estado (puede ser null para quitar voto)
      })
    });

    if (!response.ok) {
      throw new Error('Error en el servidor');
    }

    // 3. Opcional: Recargar datos desde el backend para tener información actualizada
    const datosActualizados = await response.json();
    setPropuesta(datosActualizados);

  } catch (error) {
    // 4. Revertir cambios si la API falla
    setPropuesta(propuesta);
    Alert.alert('Error', 'No se pudo registrar el voto');
  }
};
  // SIMULAR: Enviar comentario
  const handleEnviarComentario = async () => {
    if (!comentario.trim() || !propuesta) return;
    
    try {
      setEnviando(true);
      
      // TODO: Reemplazar con llamada real a API Spring
      // await fetch(`http://tu-api.com/propuestas/${idPropuesta}/comentarios`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ idUsuario, texto: comentario })
      // });
      
      // Actualizar UI localmente
      const nuevoComentario: Comentario = {
        id: Date.now(),
        idUsuario,
        usuarioNombre: 'Tú', // Esto vendrá del usuario autenticado
        texto: comentario,
        fecha: new Date().toLocaleString('es-ES')
      };
      
      setPropuesta({
        ...propuesta,
        comentarios: [...propuesta.comentarios, nuevoComentario]
      });
      
      setComentario('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el comentario');
    } finally {
      setEnviando(false);
    }
  };

  const renderComentario = ({ item }: { item: Comentario }) => (
    <View style={[
      styles.comentarioContainer,
      item.idUsuario === idUsuario && styles.comentarioPropio
    ]}>
      <Text style={styles.comentarioUsuario}>{item.usuarioNombre}</Text>
      <Text style={styles.comentarioTexto}>{item.texto}</Text>
      <Text style={styles.comentarioFecha}>{item.fecha}</Text>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.textoCargando}>Cargando propuesta...</Text>
      </View>
    );
  }

  if (!propuesta) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.textoError}>No se pudo cargar la propuesta</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con info de propuesta */}
      <View style={styles.header}>
        <Text style={styles.titulo}>{propuesta.titulo}</Text>
        <Text style={styles.descripcion}>{propuesta.descripcion}</Text>
        
        {/* Botones de votación */}
        <View style={styles.votacionContainer}>
          <TouchableOpacity 
            style={[
              styles.botonVoto, 
              styles.botonAFavor,
              propuesta.usuarioVoto === 'a-favor' && styles.botonVotoSeleccionado
            ]}
            onPress={() => handleVotar('a-favor')}
          >
            <Icon 
              name="person-add-outline" 
              size={20} 
              color={propuesta.usuarioVoto === 'a-favor' ? '#fff' : '#2ecc71'} 
            />
            <Text style={[
              styles.textoBotonVoto,
              propuesta.usuarioVoto === 'a-favor' && styles.textoBotonVotoSeleccionado
            ]}>
             Vota a favor ({propuesta.votosAFavor})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.botonVoto, 
              styles.botonEnContra,
              propuesta.usuarioVoto === 'en-contra' && styles.botonVotoSeleccionado
            ]}
            onPress={() => handleVotar('en-contra')}
          >
            <Icon 
              name="person-remove-outline" 
              size={20} 
              color={propuesta.usuarioVoto === 'en-contra' ? '#fff' : '#e74c3c'} 
            />
            <Text style={[
              styles.textoBotonVoto,
              propuesta.usuarioVoto === 'en-contra' && styles.textoBotonVotoSeleccionado
            ]}>
              Quitar tu Voto ({propuesta.usuarioVoto})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de comentarios */}
      <View style={styles.comentariosSection}>
        <Text style={styles.comentariosTitulo}>
          Comentarios de vecinos ({propuesta.comentarios.length})
        </Text>
        
        <FlatList
          data={propuesta.comentarios}
          renderItem={renderComentario}
          keyExtractor={item => item.id.toString()}
          style={styles.listaComentarios}
        />
      </View>

      {/* Formulario para nuevo comentario */}
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
              (!comentario.trim() || enviando) && styles.botonEnviarDisabled
            ]}
            onPress={handleEnviarComentario}
            disabled={!comentario.trim() || enviando}
          >
            {enviando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon name="send-outline" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Estilos (igual que antes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  textoCargando: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  textoError: {
    fontSize: 18,
    color: '#e74c3c',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 22,
  },
  votacionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botonVoto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  botonAFavor: {
    borderColor: '#2ecc71',
    backgroundColor: '#fff',
  },
  botonEnContra: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff',
  },
  botonVotoSeleccionado: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  textoBotonVoto: {
    fontWeight: '600',
    fontSize: 14,
  },
  textoBotonVotoSeleccionado: {
    color: '#fff',
  },
  comentariosSection: {
    flex: 1,
    padding: 20,
  },
  comentariosTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
  },
  listaComentarios: {
    flex: 1,
  },
  comentarioContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  comentarioPropio: {
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
  },
  comentarioUsuario: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3498db',
    marginBottom: 5,
  },
  comentarioTexto: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 20,
  },
  comentarioFecha: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'right',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: '#f8f9fa',
  },
  botonEnviar: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonEnviarDisabled: {
    backgroundColor: '#bdc3c7',
  },
});

