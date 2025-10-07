import axios from "axios";

import { CreateDeviceRequest, Device } from "@domain/model/Device";
import { API_CONFIG } from "@infra/config/apiConfig";

export const deviceApi = {
    getAllDevices: async (): Promise<Device[]> => {
        try {
            console.log("Fetching devices from API...");
            const response = await axios.get(`http://192.168.1.108:8082/api/v1/core/devices/`, {
                headers: {
                    "X-UID": 1 // TODO: replace with token
                },
            });

            const devices = response.data.data.map((d: any): Device => ({
                id: d.ID,
                uid: d.UID,
                mid: d.MID,
                rid: d.RID,
                name: d.Name,
                type: d.Type,
                port: d.Port,
                status: d.Status,
                Data: d.Data,
                RunningTime: d.RunningTime,
                CreatedAt: new Date(d.CreatedAt),
                UpdatedAt: new Date(d.UpdatedAt),
            }));

            return devices;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error("Unauthorized access");
                } else if (status === 404) {
                    throw new Error("Devices not found");
                } else {
                    throw new Error("An unexpected error:" + error.message);
                }
            }
            throw error; // Re-throw non-Axios errors
        }
    },

    createDevice: async (device: Partial<CreateDeviceRequest>): Promise<Device> => {
        try {
            const res = await axios.post(`${API_CONFIG.BASE_URL}/devices/`, device);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) {
                    throw new Error("Invalid device data");
                } else if (status === 401) {
                    throw new Error("Unauthorized access");
                } else {
                    throw new Error("An unexpected error occurred");
                }
            }
            throw error; // Re-throw non-Axios errors
        }
    },

    updateDevice: async (device: Partial<Device>): Promise<Device> => {
        try {
            const res = await axios.put(`${API_CONFIG.BASE_URL}/devices/`, device);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) {
                    throw new Error("Invalid device data");
                } else if (status === 401) {
                    throw new Error("Unauthorized access");
                } else if (status === 404) {
                    throw new Error("Device not found");
                } else {
                    throw new Error("An unexpected error occurred");
                }
            }
            throw error;
        }
    },

    deleteDevice: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_CONFIG.BASE_URL}/devices/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error("Unauthorized access");
                } else if (status === 404) {
                    throw new Error("Device not found");
                } else {
                    throw new Error("An unexpected error occurred");
                }
            }
            throw error;
        }
    },
};
