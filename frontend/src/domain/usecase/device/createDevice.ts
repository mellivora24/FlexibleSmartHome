import { CreateDeviceRequest } from "@src/domain/model/Device";
import { DeviceRepository } from "@src/domain/repo/deviceRepo";

export class CreateDevice {
    constructor(private deviceRepo: DeviceRepository) {}

    async execute(data: Partial<CreateDeviceRequest>, token: string) {
        return this.deviceRepo.createDevice(data, token);
    }
}
