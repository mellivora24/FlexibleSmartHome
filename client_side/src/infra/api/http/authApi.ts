import axios from 'axios';

import { API_CONFIG } from '@infra/config/apiConfig';
import { LoginRequest, RegisterRequest } from '@model/Auth';

export const authApi = {
    login: async (data: LoginRequest) => {
        try {
            const url = `${API_CONFIG.BASE_URL}/auth/users/login`;
            
            console.log("Login URL:", url); // Debugging line --- IGNORE ---

            const res = await axios.post(url, data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
                } else if (status === 400) {
                    throw new Error('Yêu cầu không hợp lệ');
                } else if (status === 404) {
                    throw new Error('Người dùng không tồn tại');
                } else {
                    throw new Error('Lỗi không xác định');
                }
            }
        }
    },

    register: async (data: RegisterRequest) => {
        try {
            const res = await axios.post(`${API_CONFIG.BASE_URL}/auth/users/register`, data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 400) {
                    throw new Error("Yêu cầu không hợp lệ");
                } else if (status === 409) {
                    throw new Error("Email đã được sử dụng");
                } else {
                    throw new Error("Đã xảy ra lỗi. Vui lòng thử lại.");
                }
            }
        }
    },
    verifyToken: async (token: string) => {
        try {
            const res = await axios.post(
                `${API_CONFIG.BASE_URL}/auth/verify/`, 
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error("Token không hợp lệ hoặc đã hết hạn");
                } else {
                    throw new Error("Đã xảy ra lỗi. Vui lòng thử lại.");
                }
            }
        }
    }
};
