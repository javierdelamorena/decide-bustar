import { create } from "zustand/react";
import { User } from '../../Usuario/entities/user';
import { authLogin } from "./auth";
import { AuthStatus } from "./authStatus";
import { StorrageAdater } from "../../../../adapters/Storage-adapter";

export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;
    login: (email: string, password: string) => Promise<boolean>;
}
export const useAuthStore = create<AuthState>()((set, get) => ({
    status: "cheking",
    token: undefined,
    user: undefined,




    login: async (email: string, password: string) => {


        const response = await authLogin(email, password);
        if (!response) {
            set({ status: 'unauthenticated', token: undefined, user: undefined })
            return false;
        }
        const jsonValue = JSON.stringify(response.user)
        await StorrageAdater.setItem('token', response.token);
        await StorrageAdater.setItem('user', jsonValue)

        set({ status: 'authenticated', token: response.token, user: response.user })
        return true;
    }



}))
