import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UpdateUserRequest,
    UpdateUserResponse,
} from "@domain/model/Auth";
import { authApi } from "@src/infra/api/http/authApi";

export interface AuthRepository {
    login(data: LoginRequest): Promise<LoginResponse>;
    register(data: RegisterRequest): Promise<RegisterResponse>;
    verifyToken(token: string): Promise<void>;
    updateUser(data: UpdateUserRequest, token: string): Promise<UpdateUserResponse>;
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

    async verifyToken(token: string): Promise<void> {
        try {
            return await authApi.verifyToken(token);
        } catch (error: any) {
            throw error;
        }
    }

    async updateUser(data: UpdateUserRequest, token: string): Promise<UpdateUserResponse> {
        try {
            return await authApi.updateUser(data, token);
        } catch (error: any) {
            throw error;
        }
    }
}
