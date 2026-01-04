'use client';

import { createContext, ReactNode } from "react";
import { type User } from "@/lib/auth";
import { type Account } from "better-auth";

type AuthContextType = {
    user: User;
    account: Account;
};

type AuthContextProviderProps = {
    user: User | undefined;
    account: Account | undefined;
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider =  ({ user, account, children }: AuthContextProviderProps) => {

const authData: AuthContextType | null = user && account ? { user, account } : null;

    return (
        <AuthContext value={authData}>
            {children}
        </AuthContext>
    );
}

export default AuthContextProvider;