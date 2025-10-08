import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { Device, UpdateDeviceRequest } from "@domain/model/Device";
import { DeviceRepositoryImpl } from "@domain/repo/deviceRepo";
import { DeleteDevice } from "@src/domain/usecase/device/deleteDevice";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";
import { UpdateDevice } from "@src/domain/usecase/device/updateDevice";

const deviceRepository = new DeviceRepositoryImpl();
const deleteDevice = new DeleteDevice(deviceRepository);
const getAllDevices = new GetAllDevices(deviceRepository);
const updateDevice = new UpdateDevice(deviceRepository);

export const useDevicesViewModel = () => {
    const router = useRouter();

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

    const handleEditDevice = useCallback(async (deviceUpdate: UpdateDeviceRequest) => {
        try {
            await updateDevice.execute(deviceUpdate);
            fetchDevices();
        } catch (err) {
            setError("Failed to edit device");
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

    return { devices, handleDeleteDevice, handleEditDevice, loading, error };
};
