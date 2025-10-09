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
    name: string;
    email: string;
    mcu_code: number;
    password: string;
}

export interface RegisterResponse extends User {
    token: string;
}
