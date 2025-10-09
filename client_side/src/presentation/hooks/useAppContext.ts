import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { LoginResponse, RegisterResponse } from "@domain/model/Auth";
import {
    closeSocket,
    getSocket
} from "@infra/api/websocket/socketClient";
import {
    clearAuthData,
    getToken,
    getUserInfo,
    saveToken,
    saveUserInfo,
} from "@infra/storage/authStorage";


type AuthData = LoginResponse | RegisterResponse;

interface AuthContextType {
    authData: AuthData | null;
    token: string | null;
    setUser: (data: AuthData) => void;
    login: (data: AuthData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    authData: null,
    token: null,
    setUser: () => { },
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const loadAuthData = async () => {
            const savedToken = await getToken();
            const userInfo = await getUserInfo();
            if (savedToken && userInfo) {
                setAuthData(userInfo);
                setToken(savedToken);
            }
        };
        loadAuthData();
    }, []);

    const setUser = (data: AuthData) => {
        setAuthData(data);
        setToken(data.token);
    };

    const login = async (data: AuthData) => {
        await saveToken(data.token);
        await saveUserInfo(data);
        setAuthData(data);
        setToken(data.token);
    };

    const logout = async () => {
        await clearAuthData();
        setAuthData(null);
        setToken(null);
        closeSocket();
    };

    const sendMessage = (topic: string, payload: any) => {
        const ws = getSocket();
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ topic, payload }));
        } else {
            console.warn("Socket not ready");
        }
    };

    const value = useMemo(
        () => ({
            authData,
            token,
            setUser,
            login,
            logout,
            sendMessage,
        }),
        [authData, token]
    );

    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuthContext = () => useContext(AuthContext);

export const useAuthToken = () => {
    const { token } = useContext(AuthContext);
    return token;
};

