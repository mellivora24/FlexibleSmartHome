import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { Device } from "@domain/model/Device";
import { DeviceRepositoryImpl } from "@domain/repo/deviceRepo";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";

const deviceRepository = new DeviceRepositoryImpl();
const getAllDevices = new GetAllDevices(deviceRepository);

export const useDevicesViewModel = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllDevices.execute();
            setDevices(result);
        } catch (err) {
            setError("Failed to fetch devices");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchDevices();
        }, [fetchDevices])
    );

    return { devices, loading, error };
};
