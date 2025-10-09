import { API_CONFIG } from "@infra/config/apiConfig";

let socket: WebSocket | null = null;
let listeners: ((data: any) => void)[] = [];

export const initSocket = (token: string) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(`${API_CONFIG.WS_URL}?token=${token}`);

        socket.onopen = () => {
            socket?.send(JSON.stringify({ topic: "auth", payload: token }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            listeners.forEach((cb) => cb(data));
        };

        socket.onclose = () => {
            socket = null;
        };

        socket.onerror = (err) => {
            console.error("WS error:", err);
        };
    }

    return socket;
};

export const getSocket = (): WebSocket | null => socket;

export const closeSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};

export const addSocketListener = (cb: (data: any) => void) => {
    listeners.push(cb);
};

export const removeSocketListener = (cb: (data: any) => void) => {
    listeners = listeners.filter((fn) => fn !== cb);
};

export const sendSocketMessage = (topic: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ topic, payload }));
    } else {
        console.warn("WS not ready");
    }
};
