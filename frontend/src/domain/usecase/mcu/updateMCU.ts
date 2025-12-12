import { UpdateMCURequest } from "@src/domain/model/MCU";
import { MCURepository } from "@src/domain/repo/mcuRepo";

export class UpdateMCU {
    constructor(private mcuRepo: MCURepository) {}

    async execute(data: Partial<UpdateMCURequest>, token: string) {
        return this.mcuRepo.updateMCU(data, token);
    }
}
