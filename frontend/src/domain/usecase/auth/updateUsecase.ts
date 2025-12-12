import { UpdateUserRequest, UpdateUserResponse } from "@domain/model/Auth";
import { AuthRepository } from "@domain/repo/authRepo";

export class UpdateUserUseCase {
    constructor(private authRepo: AuthRepository) {}

    async execute(data: UpdateUserRequest, token: string): Promise<UpdateUserResponse> {
        console.log("Executing UpdateUser use case");
        return this.authRepo.updateUser(data, token);
    }
}
