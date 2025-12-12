import { RegisterRequest, RegisterResponse } from "@domain/model/Auth";
import { AuthRepository } from "@src/domain/repo/authRepo";

export class RegisterUseCase {
    constructor(private repo: AuthRepository) {}

    async execute(data: RegisterRequest): Promise<RegisterResponse> {
        return this.repo.register(data);
    }
}
