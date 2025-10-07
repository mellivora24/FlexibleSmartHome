import { DeviceRepository } from "@src/domain/repo/deviceRepo";

export class DeleteDevice {
    constructor(private deviceRepo: DeviceRepository) {}

    async execute(id: string) {
        return this.deviceRepo.deleteDevice(id);
    }
}
