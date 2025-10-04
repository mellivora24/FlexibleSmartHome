import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "@domain/model/Auth";
import { authApi } from "@src/infra/api/http/authApi";

export interface AuthRepository {
    login(data: LoginRequest): Promise<LoginResponse>;
    register(data: RegisterRequest): Promise<RegisterResponse>;
}

export class AuthRepositoryImpl implements AuthRepository {
    async login(data: LoginRequest): Promise<LoginResponse> {
        try {
            return await authApi.login(data);
        } catch (error: any) {
            throw error;
        }
    }

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            return await authApi.register(data);
        } catch (error: any) {
            throw error;
        }
    }
}
