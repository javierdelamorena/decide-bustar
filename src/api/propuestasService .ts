// servicios/propuestasService.ts
import { API_URL } from '@env';

import { StorrageAdater } from '../adapters/Storage-adapter';
import { ComentariosPropuestas } from '../presentation/interfaces/ComentariosPropuestas';

export const propuestasService = {
  async obtenerPropuestaConComentarios(idPropuesta: number): Promise<ComentariosPropuestas> {
    try {
      const token = await StorrageAdater.getItem('token');
      
      const response = await fetch(`${API_URL}/propuestas/${idPropuesta}/comentarios`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ComentariosPropuestas = await response.json();
      
      // Convertir fechas string a objetos Date si es necesario
      if (typeof data.fecha === 'string') {
        data.fecha = new Date(data.fecha);
      }
      
      if (data.comentarios) {
        data.comentarios = data.comentarios.map(comentario => ({
          ...comentario,
          fecha: typeof comentario.fecha === 'string' ? new Date(comentario.fecha) : comentario.fecha
        }));
      }

      return data;

    } catch (error) {
      console.error('Error obteniendo propuesta con comentarios:', error);
      throw error;
    }
  }
};