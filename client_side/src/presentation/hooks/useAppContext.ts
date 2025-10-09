import { LoginResponse, RegisterResponse } from "@domain/model/Auth";
import {
    closeSocket,
    getSocket,
    initSocket
} from "@infra/api/websocket/socketClient";
import {
    clearAuthData,
    getToken,
    getUserInfo,
    saveToken,
    saveUserInfo,
} from "@infra/storage/authStorage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthData = LoginResponse | RegisterResponse;

interface AuthContextType {
    authData: AuthData | null;
    token: string | null;
    isConnected: boolean;
    socket: WebSocket | null;
    setUser: (data: AuthData) => void;
    login: (data: AuthData) => Promise<void>;
    logout: () => Promise<void>;
    sendMessage: (topic: string, payload: any) => void;
}

const AuthContext = createContext<AuthContextType>({
    authData: null,
    token: null,
    isConnected: false,
    socket: null,
    setUser: () => { },
    login: async () => { },
    logout: async () => { },
    sendMessage: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

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

    useEffect(() => {
        if (token) {
            const ws = initSocket(token);
            setSocket(ws);

            ws.onopen = () => setIsConnected(true);
            ws.onclose = () => setIsConnected(false);
            ws.onerror = () => setIsConnected(false);

            return () => {
                closeSocket();
                setIsConnected(false);
                setSocket(null);
            };
        }
    }, [token]);

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
        setSocket(null);
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
            socket,
            isConnected,
            setUser,
            login,
            logout,
            sendMessage,
        }),
        [authData, token, socket, isConnected]
    );

    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuthContext = () => useContext(AuthContext);

export const useAuthToken = () => {
    const { token } = useContext(AuthContext);
    return token;
};

export const useSocket = () => {
    const { socket, isConnected, sendMessage } = useContext(AuthContext);
    return { socket, isConnected, sendMessage };
};
