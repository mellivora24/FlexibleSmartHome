import { useState } from "react";

import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UpdateUserRequest,
    UpdateUserResponse
} from "@domain/model/Auth";
import { AuthRepositoryImpl } from "@domain/repo/authRepo";
import { LoginUseCase } from "@domain/usecase/auth/loginUsecase";
import { RegisterUseCase } from "@domain/usecase/auth/registerUsecase";
import { VerifyToken } from "@domain/usecase/auth/verifyToken";
import { UpdateUserUseCase } from "@domain/usecase/auth/updateUsecase";

const authRepo = new AuthRepositoryImpl();
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);
const verifyTokenUseCase = new VerifyToken(authRepo);
const updateUserUseCase = new UpdateUserUseCase(authRepo);

export function useAuthViewModel() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginRequest): Promise<LoginResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await loginUseCase.execute(data);
            setIsLoading(false);
            return response;
        } catch (err: any) {
            setError(err.message || "An error occurred");
            setIsLoading(false);
            return null;
        }
    };

    const register = async (
        data: RegisterRequest
    ): Promise<RegisterResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await registerUseCase.execute(data);
            
            if (!response || !("data" in response)) {
                throw new Error("Registration failed");
            }

            setIsLoading(false);
            return response;
        } catch (err: any) {
            setError(err.message || "An error occurred");
            setIsLoading(false);
            return null;
        }
    };

    const updateUser = async (
        data: UpdateUserRequest,
        token: string
    ): Promise<UpdateUserResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await updateUserUseCase.execute(data, token);
            setIsLoading(false);
            return response;
        } catch (err: any) {
            setError(err.message || "An error occurred");
            setIsLoading(false);
            return null;
        }
    };

    return {
        isLoading,
        error,
        login,
        register,
        updateUser,
    };
}

export const verifyToken = async (token: string): Promise<void> => {
    const authRepo = new AuthRepositoryImpl();
    const verifyTokenUseCase = new VerifyToken(authRepo);
    return verifyTokenUseCase.execute(token);
};
