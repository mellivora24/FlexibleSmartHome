import { AuthRepository } from "@src/domain/repo/authRepo";

export class VerifyToken {
    constructor(private authRepository: AuthRepository) {}

    async execute(token: string): Promise<void> {
        return this.authRepository.verifyToken(token);
    }
}
