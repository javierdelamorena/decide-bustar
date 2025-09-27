import AsyncStorage from "@react-native-async-storage/async-storage"
import { tesloApi } from "../../../api/tesloApi"
import { StorrageAdater } from "../../../adapters/Storage-adapter"
import { API_URL } from "@env"



interface Propuestas {
    idPropuesta: string,
    descripcion: string,
    idUsuario: string,
    titulo: string,
    fecha: string


}


export const propuestas = async () => {
   return StorrageAdater.getItem('token')
        .then(token => {
            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }
            return fetch(API_URL + '/propuestas/lista', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                return [];
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
}
