import { CreateMCURequest } from "@src/domain/model/MCU";
import { MCURepository } from "@src/domain/repo/mcuRepo";

export class CreateMCU {
    constructor(private mcuRepo: MCURepository) {}

    async execute(data: CreateMCURequest, token: string) {
        console.log("Executing CreateMCU use case");
        return this.mcuRepo.createMCU(data, token);
    }
}
