import { DeviceRepository } from "@src/domain/repo/deviceRepo";

export class DeleteDevice {
    constructor(private deviceRepo: DeviceRepository) {}

    async execute(id: number): Promise<void> {
        return this.deviceRepo.deleteDevice(id);
    }
}
