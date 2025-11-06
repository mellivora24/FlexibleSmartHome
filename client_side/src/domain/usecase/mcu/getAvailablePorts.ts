import { MCURepository } from "@src/domain/repo/mcuRepo";

export class GetAvailablePorts {
    constructor(private mcuRepo: MCURepository) {}

    async execute(mcuCode: number, token: string) {
        return this.mcuRepo.getAvailablePorts(mcuCode, token);
    }
}
