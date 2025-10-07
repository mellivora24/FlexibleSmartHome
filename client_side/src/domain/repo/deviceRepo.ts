import { CreateDeviceRequest, Device, UpdateDeviceRequest } from "@domain/model/Device";
import { deviceApi } from "@src/infra/api/http/deviceApi";

export interface DeviceRepository {
    getAllDevices(): Promise<Device[]>;
    createDevice(data: Partial<CreateDeviceRequest>): Promise<Device>;
    updateDevice(data: Partial<UpdateDeviceRequest>): Promise<Device>;
    deleteDevice(id: string): Promise<void>;
}

export class DeviceRepositoryImpl implements DeviceRepository {
    async getAllDevices(): Promise<Device[]> {
        try {
            const res = await deviceApi.getAllDevices();
            if (Array.isArray(res)) return res;
            if (res && Array.isArray(res)) return res;

            return [];
        } catch (error: any) {
            throw error;
        }
    }

    async createDevice(data: Partial<CreateDeviceRequest>): Promise<Device> {
        try {
            return await deviceApi.createDevice(data);
        } catch (error: any) {
            throw error;
        }
    }

    async updateDevice(data: Partial<UpdateDeviceRequest>): Promise<Device> {
        try {
            return await deviceApi.updateDevice(data);
        } catch (error: any) {
            throw error;
        }
    }

    async deleteDevice(id: string): Promise<void> {
        try {
            return await deviceApi.deleteDevice(id);
        } catch (error: any) {
            throw error;
        }
    }
}
