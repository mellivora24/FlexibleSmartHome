import { MCURepository } from "@src/domain/repo/mcuRepo";

export class DeleteMCU {
    constructor(private mcuRepo: MCURepository) {}

    async execute(id: number, token: string) {
        return this.mcuRepo.deleteMCU(id, token);
    }
}
