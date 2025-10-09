import { API_CONFIG } from "@infra/config/apiConfig";

let socket: WebSocket | null = null;
let listeners: ((data: any) => void)[] = [];
const topicListeners: Map<string, Set<(payload: any, message: any) => void>> = new Map();

export const initSocket = (token: string) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(`${API_CONFIG.WS_URL}?token=${token}`);

        socket.onopen = () => {
            socket?.send(JSON.stringify({ topic: "auth", payload: token }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            listeners.forEach((cb) => cb(data));

            const topic = data?.topic;
            if (topic && topicListeners.has(topic)) {
                const subs = topicListeners.get(topic)!;
                subs.forEach((cb) => {
                    try {
                        cb(data.payload, data);
                    } catch (e) {
                        console.error("WS topic listener error:", e);
                    }
                });
            }
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

export const addTopicListener = (
    topic: string,
    cb: (payload: any, message: any) => void
) => {
    if (!topicListeners.has(topic)) {
        topicListeners.set(topic, new Set());
    }
    topicListeners.get(topic)!.add(cb);
};

export const removeTopicListener = (
    topic: string,
    cb: (payload: any, message: any) => void
) => {
    const set = topicListeners.get(topic);
    if (!set) return;
    set.delete(cb);
    if (set.size === 0) {
        topicListeners.delete(topic);
    }
};

export const sendSocketMessage = (topic: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ topic, payload }));
    } else {
        console.warn("WS not ready");
    }
};
