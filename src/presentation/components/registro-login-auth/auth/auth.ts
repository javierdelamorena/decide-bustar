
import { tesloApi } from "../../../../api/tesloApi";
import type { AuthResponse } from "../../../interfaces/auth.response";
import { User } from "../../Usuario/entities/user";

const returnUserToken = (data: AuthResponse) => {
    const user: User = {
        id: data.id,
        email: data.email,
        username: data.username,
        apellidos: data.apellidos,
        direccion:data.direccion,
        role:data.role
        
        
       
    }
    return {
        user: user,
        token: data.token
    }

}

export const authLogin = async (email: string, password: string) => {
    try {

        const { data } = await tesloApi.post<AuthResponse>('/auth/login', {
            email, password
        })
        return returnUserToken(data)
        

    } catch (error) {
        console.log(error);
        return null;
    }

}
