import { MCURepository } from "@src/domain/repo/mcuRepo";

export class UpdateFirmware {
    constructor(private mcuRepo: MCURepository) {}

    async execute(mcuId: number, firmwareVersion: string, token: string) {
        return this.mcuRepo.updateFirmware(mcuId, firmwareVersion, token);
    }
}
