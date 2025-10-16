import { UpdateDeviceRequest } from "@src/domain/model/Device";
import { DeviceRepository } from "@src/domain/repo/deviceRepo";

export class UpdateDevice {
    constructor(private deviceRepo: DeviceRepository) {}

    async execute(data: Partial<UpdateDeviceRequest>, token: string) {
        return this.deviceRepo.updateDevice(data, token);
    }
}
