import { useState } from "react";

import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "@domain/model/Auth";
import { AuthRepositoryImpl } from "@domain/repo/authRepo";
import { MCURepositoryImpl } from "@domain/repo/mcuRepo";
import { LoginUseCase } from "@domain/usecase/auth/loginUsecase";
import { RegisterUseCase } from "@domain/usecase/auth/registerUsecase";
import { VerifyToken } from "@domain/usecase/auth/verifyToken";
import { CreateMCU } from "@domain/usecase/mcu/createMCU";

const authRepo = new AuthRepositoryImpl();
const mcuRepo = new MCURepositoryImpl();
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);
const verifyTokenUseCase = new VerifyToken(authRepo);
const createMCUUseCase = new CreateMCU(mcuRepo);

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

            const token = response.token;
            const mcuCode = response.mid;

            try {
                await createMCUUseCase.execute(
                    {
                        mcu_code: mcuCode,
                        firmware_version: "1.0.0",
                    },
                    token
                );
                console.log("MCU created successfully in core_service");
            } catch (mcuError: any) {
                console.error("MCU creation failed in core_service:", mcuError);
            }

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
    };
}

export const verifyToken = async (token: string): Promise<void> => {
    const authRepo = new AuthRepositoryImpl();
    const verifyTokenUseCase = new VerifyToken(authRepo);
    return verifyTokenUseCase.execute(token);
};
