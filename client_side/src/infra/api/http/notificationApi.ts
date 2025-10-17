import axios from 'axios';

import { NotificationListResponse } from '@model/Notification';
import { API_CONFIG } from '../../config/apiConfig';

class NotificationApi {
    async getNotifications(token: string): Promise<NotificationListResponse> {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/core/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Unauthorized access");
                else if (status === 404) throw new Error("Device not found");
                else throw new Error("An unexpected error occurred");
            }
            throw error;
        }
    }

    async markAsRead(id: number, token: string): Promise<void> {
        try {
            await axios.put(
                `${API_CONFIG.BASE_URL}/core/notifications/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Unauthorized access");
                else if (status === 404) throw new Error("Notification not found");
                else throw new Error("An unexpected error occurred");
            }
            throw error;
        }
    }
}

export const notificationApi = new NotificationApi();