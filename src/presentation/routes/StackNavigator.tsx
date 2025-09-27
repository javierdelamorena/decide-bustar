import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HelloWordScreens } from '../components/entrada/HelloWordScreens';
import { ListaPropuestasVisibles } from '../components/registro-login-auth/inicio/ListaPropuestasVisibles';
import { Login } from '../components/registro-login-auth/inicio/Login';
import { Register } from '../components/registro-login-auth/inicio//Register';
import { Baja } from '../components/Usuario/datosUsuario/Baja';
import { EditarUsuario } from '../components/Usuario/datosUsuario/EditarUsuario';
import { ChatPropuesta } from '../components/Usuario/propuestas/ChatPropuesta';
import { ListaPropuestas } from '../components/Usuario/propuestas/Listapropuestas';
import { RealizarPropuesta } from '../components/Usuario/propuestas/Realizarpropuesta';
import { TusPropuestas } from '../components/Usuario/propuestas/TusPropuestas';
import { Usuario } from '../components/Usuario/datosUsuario/Usuario';
import { EditarPropuesta } from '../components/Usuario/propuestas/EditarPropuesta';


export type RootStackParams={
  Decide_Bustar:undefined,
  Login:undefined,
  Register:undefined,
  Counter:undefined,
  ChatPropuesta?:{idPropuesta:number,idUsuario:number},
  Usuario:undefined,
  RealizarPropuesta:undefined,
  TusPropuestas:undefined,
  ListaPropuestas: undefined,
  EditarUsuario: undefined,
  Propuestas: undefined,
  Baja: undefined,
  EditarPropuesta?:{idPropuesta:number,titulo:string,descripcion:string},
 
}
// Crear el Stack Navigator correctamente
const Stack = createNativeStackNavigator<RootStackParams>();

// Componente que contiene la navegación
export const StackNavigator=()=> {
    
  return (
    <Stack.Navigator>
      <Stack.Screen name="Decide_Bustar" component={HelloWordScreens} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Usuario" component={Usuario} />
      <Stack.Screen name="ChatPropuesta" component={ChatPropuesta} />
      <Stack.Screen name="RealizarPropuesta" component={RealizarPropuesta} />
      <Stack.Screen name="TusPropuestas" component={TusPropuestas} />
      <Stack.Screen name="ListaPropuestas" component={ListaPropuestas} />
      <Stack.Screen name="Propuestas" component={ListaPropuestasVisibles} />
      <Stack.Screen name="EditarUsuario" component={EditarUsuario} />
      <Stack.Screen name="EditarPropuesta" component={EditarPropuesta} />
      <Stack.Screen name="Baja" component={Baja} />
     

      
    </Stack.Navigator>
  );
}
  

