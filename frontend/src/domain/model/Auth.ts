export interface User {
    id: number;
    mid: number;
    name: string;
    email: string;
    created_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    mid: number;
    name: string;
    email: string;
    token: string;
}

export interface RegisterRequest {
    mcu_code: number;
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse extends User {
    token: string;
}

export interface UpdateUserRequest {
    id: number;
    name?: string;
    email?: string;
    mcu_code?: number;
}

export interface UpdateUserResponse {
    id: number;
    mid: number;
    mcu_code: number;
    name: string;
    email: string;
}
