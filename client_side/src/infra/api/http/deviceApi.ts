import axios from "axios";

import { CreateDeviceRequest, Device } from "@domain/model/Device";
import { API_CONFIG } from "@infra/config/apiConfig";

export const deviceApi = {
    getAllDevices: async (): Promise<Device[]> => {
        try {
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
                    console.log("API not found");
                    return [];
                } else {
                    console.log("API other error");
                    return [];
                }
            }
            throw error; // Re-throw non-Axios errors
        }
    },

    createDevice: async (device: Partial<CreateDeviceRequest>): Promise<Device> => {
        console.log("Creating device with data (running at api layer):", device);
        try {
            const res = await axios.post(`http://192.168.1.108:8082/api/v1/core/devices/`, device, {
                headers: {
                    "X-UID": 1 // TODO: replace with token
                },
            });
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
            const res = await axios.put(`${API_CONFIG.BASE_URL}/devices/`, device, {
                headers: {
                    "X-UID": 1 // TODO: replace with token
                },
            });
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) {
                    console.log("Invalid device data");
                } else if (status === 401) {
                    console.log("Unauthorized access");
                } else if (status === 404) {
                    console.log("Device not found");
                } else {
                    console.log("An unexpected error occurred: ", error.message);
                }
            }
            throw error;
        }
    },

    deleteDevice: async (id: number): Promise<void> => {
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
