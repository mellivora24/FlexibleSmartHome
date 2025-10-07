import { Device } from "@domain/model/Device";
import { DeviceRepository } from "@src/domain/repo/deviceRepo";

export class GetAllDevices {
    constructor(private deviceRepo: DeviceRepository) {}

    async execute(): Promise<Device[]> {
        return this.deviceRepo.getAllDevices();
    }
}
