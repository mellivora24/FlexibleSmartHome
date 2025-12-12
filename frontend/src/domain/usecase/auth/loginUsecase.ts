import { LoginRequest, LoginResponse } from "@domain/model/Auth";
import { AuthRepository } from "@src/domain/repo/authRepo";

export class LoginUseCase {
    constructor(private repo: AuthRepository) {}

    async execute(data: LoginRequest): Promise<LoginResponse> {
        return this.repo.login(data);
    }
}
