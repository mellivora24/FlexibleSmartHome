import { CreateDeviceRequest, Device } from "@domain/model/Device";
import { API_CONFIG } from "@infra/config/apiConfig";
import axios from "axios";

export const deviceApi = {
    getAllDevices: async (token: string): Promise<Device[]> => {
        console.log("Fetching all devices (running at api layer)");
        try {
            const res = await axios.get(`${API_CONFIG.BASE_URL}/core/devices/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const devices = res.data.data.map((d: any): Device => ({
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
                if (status === 401) throw new Error("Unauthorized access");
                if (status === 404) {
                    console.log("API not found");
                    return [];
                }
                console.log("API other error");
                return [];
            }
            throw error;
        }
    },

    createDevice: async (device: Partial<CreateDeviceRequest>, token: string): Promise<Device> => {
        console.log("Creating device (running at api layer)");
        try {
            const res = await axios.post(
                `${API_CONFIG.BASE_URL}/core/devices/`,
                device,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) console.log("Invalid device data");
                else if (status === 401) console.log("Unauthorized access");
                else console.log("Unexpected error: ", error.message);
            }
            throw error;
        }
    },

    updateDevice: async (device: Partial<Device>, token: string): Promise<Device> => {
        console.log("Updating device (running at api layer)");
        try {
            const res = await axios.put(
                `${API_CONFIG.BASE_URL}/core/devices/`,
                device,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) console.log("Invalid device data");
                else if (status === 401) console.log("Unauthorized access");
                else if (status === 404) console.log("Device not found");
                else console.log("Unexpected error: ", error.message);
            }
            throw error;
        }
    },

    deleteDevice: async (id: number, token: string): Promise<void> => {
        console.log("Deleting device (running at api layer)");
        try {
            await axios.delete(`${API_CONFIG.BASE_URL}/core/devices/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Unauthorized access");
                else if (status === 404) throw new Error("Device not found");
                else throw new Error("An unexpected error occurred");
            }
            throw error;
        }
    },
};
