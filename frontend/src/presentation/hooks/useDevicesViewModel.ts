import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "@domain/model/Device";
import { DeviceRepositoryImpl } from "@domain/repo/deviceRepo";
import { MCURepositoryImpl } from "@domain/repo/mcuRepo";
import { CreateDevice } from "@src/domain/usecase/device/createDevice";
import { DeleteDevice } from "@src/domain/usecase/device/deleteDevice";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";
import { UpdateDevice } from "@src/domain/usecase/device/updateDevice";
import { GetAvailablePorts } from "@src/domain/usecase/mcu/getAvailablePorts";
import { useAuthContext } from "@src/presentation/hooks/useAppContext";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

const deviceRepository = new DeviceRepositoryImpl();
const mcuRepository = new MCURepositoryImpl();
const deleteDevice = new DeleteDevice(deviceRepository);
const getAllDevices = new GetAllDevices(deviceRepository);
const updateDevice = new UpdateDevice(deviceRepository);
const createDevice = new CreateDevice(deviceRepository);
const getAvailablePorts = new GetAvailablePorts(mcuRepository);

export const useDevicesViewModel = (token: string) => {
    const { authData } = useAuthContext();
    
    const [devices, setDevices] = useState<Device[]>([]);
    const [availablePorts, setAvailablePorts] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPorts, setLoadingPorts] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [openModal, setOpenModal] = useState(false);

    const showError = (err: unknown, fallback: string) => {
        let message = fallback;
        if (axios.isAxiosError(err)) {
            message = err.response?.data?.message || err.message || fallback;
        }
        setError(message);
        setShowErrorModal(true);
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccessModal(true);
    };

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllDevices.execute(token);
            setDevices(result);
        } catch (err) {
            showError(err, "Không thể tải danh sách thiết bị");
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchAvailablePorts = useCallback(async () => {
        setLoadingPorts(true);
        try {
            const ports = await getAvailablePorts.execute(123456, token);
            setAvailablePorts(ports);
        } catch (err) {
            console.error("Failed to fetch available ports:", err);
            showError(err, "Không thể tải danh sách cổng khả dụng");
            setAvailablePorts([]);
        } finally {
            setLoadingPorts(false);
        }
    }, [authData?.mid, token]);

    const handleOpenModal = useCallback(async () => {
        setOpenModal(true);
        await fetchAvailablePorts();
    }, [fetchAvailablePorts]);

    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setAvailablePorts([]);
    }, []);

    const handleCreateDevice = useCallback(
        async (deviceCreate: CreateDeviceRequest) => {
            try {
                await createDevice.execute(deviceCreate, token);
                await fetchDevices();
                handleCloseModal();
                showSuccess("Tạo thiết bị thành công!");
            } catch (err) {
                showError(err, "Không thể tạo thiết bị");
            }
        },
        [token, fetchDevices, handleCloseModal]
    );

    const handleEditDevice = useCallback(
        async (deviceUpdate: UpdateDeviceRequest) => {
            try {
                await updateDevice.execute(deviceUpdate, token);
                await fetchDevices();
                showSuccess("Cập nhật thiết bị thành công!");
            } catch (err) {
                showError(err, "Không thể cập nhật thiết bị");
            }
        },
        [token, fetchDevices]
    );

    const handleDeleteDevice = useCallback(
        async (deviceId: number) => {
            try {
                await deleteDevice.execute(deviceId, token);
                await fetchDevices();
                showSuccess("Xóa thiết bị thành công!");
            } catch (err) {
                showError(err, "Không thể xóa thiết bị");
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
        availablePorts,
        loading,
        loadingPorts,
        error,
        openModal,
        showErrorModal,
        showSuccessModal,
        successMessage,
        setShowErrorModal,
        setShowSuccessModal,
        handleOpenModal,
        handleCloseModal,
        handleCreateDevice,
        handleEditDevice,
        handleDeleteDevice,
    };
};
