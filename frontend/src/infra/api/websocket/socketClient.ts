import { API_CONFIG } from "@infra/config/apiConfig";

type Listener = {
    topic: string | null;
    callback: (data: any) => void;
};

let socket: WebSocket | null = null;
let listeners: Listener[] = [];
let messageBuffer: any[] = [];
let isConnected = false;
let reconnectTimeout: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

export const initSocket = (token: string) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(`${API_CONFIG.WS_URL}?token=${token}`);
        isConnected = false;

        socket.onopen = () => {
            isConnected = true;
            reconnectAttempts = 0;
            
            socket?.send(JSON.stringify({ topic: "auth", payload: token }));
            
            if (messageBuffer.length > 0) {
                messageBuffer.forEach(data => notifyListeners(data));
                messageBuffer = [];
            }
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (listeners.length === 0) {
                    messageBuffer.push(data);
                } else {
                    notifyListeners(data);
                }
            } catch (err) {
                console.error("Error parsing WS message:", err);
            }
        };

        socket.onclose = () => {
            socket = null;
            isConnected = false;
            
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                reconnectTimeout = setTimeout(() => {
                    initSocket(token);
                }, RECONNECT_DELAY);
            } else {
                messageBuffer = [];
            }
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            isConnected = false;
        };
    }

    return socket;
};

const notifyListeners = (data: any) => {
    const messageTopic = data.topic || null;
    
    listeners.forEach(({ topic, callback }) => {
        if (topic === null || topic === messageTopic) {
            try {
                callback(data);
            } catch (err) {
                console.error(`Error in listener callback for topic "${topic}":`, err);
            }
        }
    });
};

export const getSocket = (): WebSocket | null => socket;

export const closeSocket = () => {
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }
    
    if (socket) {
        socket.close();
        socket = null;
    }
    
    isConnected = false;
    messageBuffer = [];
    reconnectAttempts = 0;
};

export const addSocketListener = (
    callback: (data: any) => void,
    topic: string | null = null
) => {
    const listener: Listener = { topic, callback };
    listeners.push(listener);
    
    if (messageBuffer.length > 0) {
        messageBuffer.forEach(data => {
            const messageTopic = data.topic || null;
            if (topic === null || topic === messageTopic) {
                try {
                    callback(data);
                } catch (err) {
                    console.error("Error replaying buffered message:", err);
                }
            }
        });
    }
    
    return () => removeSocketListener(callback);
};

export const removeSocketListener = (callback: (data: any) => void) => {
    listeners = listeners.filter((listener) => listener.callback !== callback);
};

export const sendSocketMessage = (topic: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ topic, payload }));
    } else {
        console.warn(`WebSocket not ready (readyState: ${socket?.readyState})`);
    }
};

export const isSocketConnected = (): boolean => {
    return isConnected && socket?.readyState === WebSocket.OPEN;
};

export const waitForConnection = (timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (isSocketConnected()) {
            resolve();
            return;
        }

        const timeoutId = setTimeout(() => {
            reject(new Error("WebSocket connection timeout"));
        }, timeout);

        const checkInterval = setInterval(() => {
            if (isSocketConnected()) {
                clearTimeout(timeoutId);
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
};
