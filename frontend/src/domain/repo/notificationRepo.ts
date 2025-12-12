import { NotificationListResponse } from "@model/Notification";
import { notificationApi } from "@src/infra/api/http/notificationApi";

export interface NotificationRepository {
    getNotifications(token: string): Promise<NotificationListResponse>;
    markAsRead(id: number, token: string): Promise<void>;
}

export class NotificationRepositoryImpl implements NotificationRepository {
    async getNotifications(token: string): Promise<NotificationListResponse> {
        try {
            return await notificationApi.getNotifications(token);
        } catch (error: any) {
            throw error;
        }
    }

    async markAsRead(id: number, token: string): Promise<void> {
        try {
            return await notificationApi.markAsRead(id, token);
        } catch (error: any) {
            throw error;
        }
    }
}
