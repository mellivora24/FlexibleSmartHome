import { NotificationRepositoryImpl } from '@domain/repo/notificationRepo';
import { useAuthToken } from '@hooks/useAppContext';
import { Notification, NotificationEntity } from '@model/Notification';
import { GetNotifications } from '@usecase/notification/getNotifications';
import { MarkAsRead } from '@usecase/notification/markAsReadUsecase';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const notificationRepository = new NotificationRepositoryImpl();
const getNotificationsUsecase = new GetNotifications(notificationRepository);
const markAsReadUsecase = new MarkAsRead(notificationRepository);

interface NotificationContextType {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    formatDate: (dateString: string) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = useAuthToken();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (!token) {
            setError('Authentication token is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const result = await getNotificationsUsecase.execute(token);
            if (result.success) {
                setNotifications(result.data.list);
                setError(null);
            } else {
                setError('Failed to fetch notifications');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error fetching notifications';
            setError(message);
            console.error('Fetch notifications error:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Cập nhật unreadCount mỗi khi notifications thay đổi
    useEffect(() => {
        const unread = notifications.filter(n => !n.IsRead).length;
        setUnreadCount(unread);
    }, [notifications]);

    // Fetch notifications khi token thay đổi
    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token, fetchNotifications]);

    const markAsRead = useCallback(
        async (id: number) => {
            try {
                // Cập nhật state ngay lập tức (optimistic update)
                setNotifications(prev =>
                    prev.map(n => (n.ID === id ? { ...n, IsRead: true } : n))
                );

                // Gửi request lên server
                await markAsReadUsecase.execute(id, token);
            } catch (err) {
                console.error('Mark as read error:', err);
                // Nếu lỗi, refresh lại dữ liệu
                await fetchNotifications();
            }
        },
        [token, fetchNotifications]
    );

    const formatDate = (dateString: string): string => {
        const entity = NotificationEntity.fromJSON({
            ID: 0,
            UID: 0,
            McuCode: 0,
            Title: '',
            Message: '',
            IsRead: false,
            CreatedAt: dateString,
        });
        return entity.getRelativeTime();
    };

    const value: NotificationContextType = {
        notifications,
        loading,
        error,
        unreadCount,
        fetchNotifications,
        markAsRead,
        formatDate,
    };

    return React.createElement(NotificationContext.Provider, { value }, children);
};

// Custom hook để sử dụng context
export const useNotificationContext = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return context;
};
