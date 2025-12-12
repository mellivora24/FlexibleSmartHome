import { CreateMCURequest, MCU, UpdateMCURequest } from "@domain/model/MCU";
import { API_CONFIG } from "@infra/config/apiConfig";
import axios from "axios";

export const mcuApi = {
    getAllMCUs: async (token: string): Promise<MCU[]> => {
        console.log("Fetching all MCUs (running at api layer)");
        try {
            const res = await axios.get(`${API_CONFIG.BASE_URL}/core/mcus/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const mcus = res.data.data.map((m: any): MCU => ({
                id: m.ID,
                uid: m.UID,
                mcuCode: m.McuCode,
                availablePort: m.AvailablePort || [],
                firmwareVersion: m.FirmwareVersion,
                CreatedAt: new Date(m.CreatedAt),
            }));

            return mcus;
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

    getMCUById: async (id: number, token: string): Promise<MCU> => {
        console.log("Fetching MCU by ID (running at api layer)");
        try {
            const res = await axios.get(`${API_CONFIG.BASE_URL}/core/mcus/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const m = res.data.data;
            return {
                id: m.ID,
                uid: m.UID,
                mcuCode: m.McuCode,
                availablePort: m.AvailablePort || [],
                firmwareVersion: m.FirmwareVersion,
                CreatedAt: new Date(m.CreatedAt),
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Unauthorized access");
                if (status === 404) throw new Error("MCU not found");
            }
            throw error;
        }
    },

    createMCU: async (mcu: CreateMCURequest, token: string): Promise<MCU> => {
        console.log("Creating MCU (running at api layer)");
        try {
            const res = await axios.post(
                `${API_CONFIG.BASE_URL}/core/mcus/`,
                {
                    mcu_code: mcu.mcu_code,
                    firmware_version: mcu.firmware_version,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const m = res.data.data;
            return {
                id: m.ID,
                uid: m.UID,
                mcuCode: m.McuCode,
                availablePort: m.AvailablePort || [],
                firmwareVersion: m.FirmwareVersion,
                CreatedAt: new Date(m.CreatedAt),
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) console.log("Invalid MCU data");
                else if (status === 401) console.log("Unauthorized access");
                else console.log("Unexpected error: ", error.message);
            }
            throw error;
        }
    },

    updateMCU: async (mcu: Partial<UpdateMCURequest>, token: string): Promise<MCU> => {
        console.log("Updating MCU (running at api layer)");
        try {
            const res = await axios.put(
                `${API_CONFIG.BASE_URL}/core/mcus/`,
                mcu,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const m = res.data.data;
            return {
                id: m.ID,
                uid: m.UID,
                mcuCode: m.McuCode,
                availablePort: m.AvailablePort || [],
                firmwareVersion: m.FirmwareVersion,
                CreatedAt: new Date(m.CreatedAt),
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) console.log("Invalid MCU data");
                else if (status === 401) console.log("Unauthorized access");
                else if (status === 404) console.log("MCU not found");
                else console.log("Unexpected error: ", error.message);
            }
            throw error;
        }
    },

    updateFirmware: async (
        mcuId: number, 
        firmwareVersion: string, 
        token: string
    ): Promise<MCU> => {
        console.log("Updating MCU firmware (running at api layer)");
        try {
            const res = await axios.put(
                `${API_CONFIG.BASE_URL}/core/mcus/firmware`,
                {
                    id: mcuId,
                    firmwareVersion: firmwareVersion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const m = res.data.data;
            return {
                id: m.ID,
                uid: m.UID,
                mcuCode: m.McuCode,
                availablePort: m.AvailablePort || [],
                firmwareVersion: m.FirmwareVersion,
                CreatedAt: new Date(m.CreatedAt),
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) console.log("Invalid firmware data");
                else if (status === 401) console.log("Unauthorized access");
                else if (status === 404) console.log("MCU not found");
                else console.log("Unexpected error: ", error.message);
            }
            throw error;
        }
    },

    getAvailablePorts: async (mcuCode: number, token: string): Promise<number[]> => {
        console.log("Fetching available ports (running at api layer)");
        try {
            const res = await axios.get(
                `${API_CONFIG.BASE_URL}/core/mcus/${mcuCode}/available-ports`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.data.data || [];
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Unauthorized access");
                if (status === 404) {
                    console.log("MCU not found");
                    return [];
                }
                console.log("API other error");
                return [];
            }
            throw error;
        }
    },

    deleteMCU: async (id: number, token: string): Promise<void> => {
        console.log("Deleting MCU (running at api layer)");
        try {
            await axios.delete(`${API_CONFIG.BASE_URL}/core/mcus/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Unauthorized access");
                else if (status === 404) throw new Error("MCU not found");
                else throw new Error("An unexpected error occurred");
            }
            throw error;
        }
    },
};
