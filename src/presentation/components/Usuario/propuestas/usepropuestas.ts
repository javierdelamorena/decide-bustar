import { API_URL } from "@env";
import { StorrageAdater } from "../../../../adapters/Storage-adapter";
import { Alert } from "react-native";
import { PropuestaUsuario } from '../../../interfaces/PropuestaUsuario';

// usePropuestasUsuario.ts
export const cargarTusPropuestas = async (): Promise<PropuestaUsuario[]> => {
  try {
    const token = await StorrageAdater.getItem('token');
    if (!token) throw new Error('No se encontró token');

    const userJson = await StorrageAdater.getItem('user');
    if (!userJson) {
      Alert.alert('Error', 'No se encontraron datos de usuario');
      return [];
    }

    const userData = JSON.parse(userJson);

    const response = await fetch(`${API_URL}/propuestas/tusPropuestas/${userData.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data: PropuestaUsuario[] = await response.json();
    console.log('Propuestas cargadas:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'No se pudieron cargar las propuestas');
    return [];
  }
};