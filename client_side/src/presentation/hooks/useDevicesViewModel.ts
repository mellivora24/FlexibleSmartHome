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

    const handleCreateDevice = useCallback(
        async (deviceCreate: CreateDeviceRequest) => {
            try {
                await createDevice.execute(deviceCreate, token);
                await fetchDevices();
                setOpenModal(false);
                showSuccess("Tạo thiết bị thành công!");
            } catch (err) {
                showError(err, "Không thể tạo thiết bị");
            }
        },
        [token, fetchDevices]
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
        loading,
        error,
        openModal,
        showErrorModal,
        showSuccessModal,
        successMessage,
        setShowErrorModal,
        setShowSuccessModal,
        setOpenModal,
        handleCreateDevice,
        handleEditDevice,
        handleDeleteDevice,
    };
};
