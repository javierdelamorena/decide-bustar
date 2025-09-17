import { create } from "zustand/react";
import { User } from "../../Usuario/entities/user";
import { authLogin } from "./auth";
import { AuthStatus } from "./authStatus";

export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;
    login: (user_name: string, password: string) => Promise<boolean>;
}
export const useAuthStore = create<AuthState>()((set, get) => ({
    status: "cheking",
    token: undefined,
    user: undefined,




    login: async (user_name: string, password: string) => {

        const response = await authLogin(user_name, password);
        if (!response) {
            set({ status: 'unauthenticated', token: undefined, user: undefined })
            return false;
        }
        set({ status: 'authenticated', token: response.token, user: response.user })
        return true;
    }



}))