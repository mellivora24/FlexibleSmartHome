import axios from 'axios';

import { API_CONFIG } from '@infra/config/apiConfig';
import { LoginRequest, RegisterRequest } from '@src/domain/model/Auth';

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await axios.post(`${API_CONFIG.BASE_URL}/auth/users/login`, data);
    return res.data;
  },

  register: async (data: RegisterRequest) => {
    const res = await axios.post(`${API_CONFIG.BASE_URL}/auth/users/`, data);
    return res.data;
  },
};
