import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { Device } from "@domain/model/Device";
import { DeviceRepositoryImpl } from "@domain/repo/deviceRepo";
import { DeleteDevice } from "@src/domain/usecase/device/deleteDevice";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";


const deviceRepository = new DeviceRepositoryImpl();
const deleteDevice = new DeleteDevice(deviceRepository);
const getAllDevices = new GetAllDevices(deviceRepository);

export const useDevicesViewModel = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteDevice = useCallback(async (deviceId: number) => {
        try {
            await deleteDevice.execute(deviceId);
            fetchDevices();
        } catch (err) {
            setError("Failed to delete device");
        }
    }, []);

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

    return { devices, handleDeleteDevice, loading, error };
};
