import {
    addSocketListener,
    sendSocketMessage,
} from "@infra/api/websocket/socketClient";
import { useCallback, useEffect, useState } from "react";

export type ControlPayload = {
    did: string | number;
    value?: string | number;
    command: string;
};

export type ControlResponse = {
    did: string | number;
    value?: string | number;
    command?: string;
    status?: boolean;
};

export const useDeviceControl = (deviceId: string | number) => {
    const [isControlling, setIsControlling] = useState(false);
    const [lastResponse, setLastResponse] = useState<ControlResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe_1 = addSocketListener((data) => {
            const { topic, payload } = data;

            if (topic === "control_response" && payload?.did === deviceId) {
                setIsControlling(false);

                const command = String(payload.command);
                const normalizedValue = typeof payload.value === "number"
                    ? payload.value
                    : Number(payload.value) || 0;

                let status: boolean | undefined;
                if (command === "on") {
                    status = true;
                } else if (command === "off") {
                    status = false;
                }

                const normalizedResponse: ControlResponse = {
                    did: payload.did,
                    value: normalizedValue,
                    command,
                    status,
                };

                setLastResponse(normalizedResponse);
                setError(null);
            }
        }, "control_response");

        const unsubscribe_2 = addSocketListener((data) => {
            const { topic, payload } = data;

            if (topic === "sensor_data" && payload?.did === deviceId) {
                const normalizedValue = typeof payload.value === "number"
                    ? payload.value
                    : Number(payload.value) || 0;

                const normalizedResponse: ControlResponse = {
                    did: payload.did,
                    value: normalizedValue,
                };

                setLastResponse(normalizedResponse);
            }
        }, "sensor_data");

        return () => {
            unsubscribe_1();
            unsubscribe_2();
        };
    }, [deviceId]);

    const sendControl = useCallback(
        (command: string, value?: number) => {
            setIsControlling(true);
            setError(null);

            const payload: ControlPayload = {
                did: deviceId,
                command,
            };

            if (value !== undefined) {
                payload.value = value;
            }

            console.log("[WS] Sending control:", payload);
            sendSocketMessage("control", payload);
        },
        [deviceId]
    );

    return { sendControl, isControlling, lastResponse, error };
};
