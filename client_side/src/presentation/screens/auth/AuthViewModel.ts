import { useState } from "react";

import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "@domain/model/Auth";
import { AuthRepositoryImpl } from "@domain/repo/authRepo";
import { LoginUseCase } from "@domain/usecase/auth/loginUsecase";
import { RegisterUseCase } from "@domain/usecase/auth/registerUsecase";

const authRepo = new AuthRepositoryImpl();
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

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
        register
    };
}
