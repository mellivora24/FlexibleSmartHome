import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "@domain/model/Device";
import { deviceApi } from "@src/infra/api/http/deviceApi";

export interface DeviceRepository {
    getAllDevices(token: string): Promise<Device[]>;
    createDevice(data: Partial<CreateDeviceRequest>, token: string): Promise<Device>;
    updateDevice(data: Partial<UpdateDeviceRequest>, token: string): Promise<Device>;
    deleteDevice(id: number, token: string): Promise<void>;
}

export class DeviceRepositoryImpl implements DeviceRepository {
    async getAllDevices(token: string): Promise<Device[]> {
        try {
            const res = await deviceApi.getAllDevices(token);
            if (Array.isArray(res)) return res;
            return [];
        } catch (error: any) {
            throw error;
        }
    }

    async createDevice(data: Partial<CreateDeviceRequest>, token: string): Promise<Device> {
        try {
            return await deviceApi.createDevice(data, token);
        } catch (error: any) {
            throw error;
        }
    }

    async updateDevice(data: Partial<UpdateDeviceRequest>, token: string): Promise<Device> {
        try {
            return await deviceApi.updateDevice(data, token);
        } catch (error: any) {
            throw error;
        }
    }

    async deleteDevice(id: number, token: string): Promise<void> {
        try {
            return await deviceApi.deleteDevice(id, token);
        } catch (error: any) {
            throw error;
        }
    }
}
