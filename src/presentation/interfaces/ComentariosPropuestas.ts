// interfaces.ts
export interface ComentariosPropuestas {
  idPropuesta: number;
  descripcion: string;
  titulo: string;
  fecha: Date | string; // Puede venir como string desde JSON y convertirse a Date
  idUsuario: number;
  comentarios: Comentarios[];
}

export interface Comentarios {
  id?: number;
  idUsuario: number;
  usuarioNombre?: string;
  texto: string;
  fecha: Date | string;
  idPropuesta?: number;
}

// Si tu backend envía más campos en Propuestas, agrega esta interfaz
export interface Propuestas {
  idPropuesta: number;
  titulo: string;
  descripcion: string;
  fecha: Date | string;
  idUsuario: number;
  votosAFavor?: number;
  votosEnContra?: number;
  usuarioVoto?: 'a-favor' | 'en-contra' | null;
}