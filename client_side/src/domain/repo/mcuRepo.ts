import { CreateMCURequest, MCU, UpdateMCURequest } from "@domain/model/MCU";
import { mcuApi } from "@src/infra/api/http/mcuApi";

export interface MCURepository {
    getAllMCUs(token: string): Promise<MCU[]>;
    getMCUById(id: number, token: string): Promise<MCU>;
    createMCU(data: CreateMCURequest, token: string): Promise<MCU>;
    updateMCU(data: Partial<UpdateMCURequest>, token: string): Promise<MCU>;
    updateFirmware(mcuId: number, firmwareVersion: string, token: string): Promise<MCU>;
    getAvailablePorts(mcuCode: number, token: string): Promise<number[]>;
    deleteMCU(id: number, token: string): Promise<void>;
}

export class MCURepositoryImpl implements MCURepository {
    async getAllMCUs(token: string): Promise<MCU[]> {
        try {
            const res = await mcuApi.getAllMCUs(token);
            if (Array.isArray(res)) return res;
            return [];
        } catch (error: any) {
            throw error;
        }
    }

    async getMCUById(id: number, token: string): Promise<MCU> {
        try {
            return await mcuApi.getMCUById(id, token);
        } catch (error: any) {
            throw error;
        }
    }

    async createMCU(data: CreateMCURequest, token: string): Promise<MCU> {
        try {
            return await mcuApi.createMCU(data, token);
        } catch (error: any) {
            throw error;
        }
    }

    async updateMCU(data: Partial<UpdateMCURequest>, token: string): Promise<MCU> {
        try {
            return await mcuApi.updateMCU(data, token);
        } catch (error: any) {
            throw error;
        }
    }

    async updateFirmware(mcuId: number, firmwareVersion: string, token: string): Promise<MCU> {
        try {
            return await mcuApi.updateFirmware(mcuId, firmwareVersion, token);
        } catch (error: any) {
            throw error;
        }
    }

    async getAvailablePorts(mcuCode: number, token: string): Promise<number[]> {
        try {
            const res = await mcuApi.getAvailablePorts(mcuCode, token);
            if (Array.isArray(res)) return res;
            return [];
        } catch (error: any) {
            throw error;
        }
    }

    async deleteMCU(id: number, token: string): Promise<void> {
        try {
            return await mcuApi.deleteMCU(id, token);
        } catch (error: any) {
            throw error;
        }
    }
}
