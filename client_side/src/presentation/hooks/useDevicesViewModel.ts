import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "@domain/model/Device";
import { DeviceRepositoryImpl } from "@domain/repo/deviceRepo";
import { CreateDevice } from "@src/domain/usecase/device/createDevice";
import { DeleteDevice } from "@src/domain/usecase/device/deleteDevice";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";
import { UpdateDevice } from "@src/domain/usecase/device/updateDevice";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

const deviceRepository = new DeviceRepositoryImpl();
const deleteDevice = new DeleteDevice(deviceRepository);
const getAllDevices = new GetAllDevices(deviceRepository);
const updateDevice = new UpdateDevice(deviceRepository);
const createDevice = new CreateDevice(deviceRepository);

export const useDevicesViewModel = (token: string) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const showError = (err: unknown, fallback: string) => {
        let message = fallback;
        if (axios.isAxiosError(err)) {
            message = err.response?.data?.message || err.message || fallback;
        }
        setError(message);
        setShowErrorModal(true);
    };

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllDevices.execute(token);
            setDevices(result);
        } catch (err) {
            showError(err, "Failed to fetch devices");
        } finally {
            setLoading(false);
        }
    }, [token]);

    const handleCreateDevice = useCallback(
        async (deviceCreate: CreateDeviceRequest) => {
            try {
                await createDevice.execute(deviceCreate, token);
                fetchDevices();
            } catch (err) {
                showError(err, "Failed to create device");
            }
        },
        [token, fetchDevices]
    );

    const handleEditDevice = useCallback(
        async (deviceUpdate: UpdateDeviceRequest) => {
            try {
                await updateDevice.execute(deviceUpdate, token);
                fetchDevices();
            } catch (err) {
                showError(err, "Failed to update device");
            }
        },
        [token, fetchDevices]
    );

    const handleDeleteDevice = useCallback(
        async (deviceId: number) => {
            try {
                await deleteDevice.execute(deviceId, token);
                fetchDevices();
            } catch (err) {
                showError(err, "Failed to delete device");
            }
        },
        [token, fetchDevices]
    );

    useFocusEffect(
        useCallback(() => {
            fetchDevices();
        }, [fetchDevices])
    );

    return {
        devices,
        loading,
        error,
        openModal,
        showErrorModal,
        setShowErrorModal,
        setOpenModal,
        handleCreateDevice,
        handleEditDevice,
        handleDeleteDevice,
    };
};
