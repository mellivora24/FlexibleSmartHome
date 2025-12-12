import { NotificationRepositoryImpl } from '@domain/repo/notificationRepo';
import { Notification, NotificationEntity } from '@model/Notification';
import { GetNotifications } from '@usecase/notification/getNotifications';
import { MarkAsRead } from '@usecase/notification/markAsReadUsecase';
import { useCallback, useEffect, useState } from 'react';

const notificationRepository = new NotificationRepositoryImpl();
const getNotificationsUsecase = new GetNotifications(notificationRepository);
const markAsReadUsecase = new MarkAsRead(notificationRepository);

interface UseNotificationViewModelReturn {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    formatDate: (dateString: string) => string;
}

export const useNotificationViewModel = (token: string): UseNotificationViewModelReturn => {
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

    useEffect(() => {
        const unread = notifications.filter(n => !n.IsRead).length;
        setUnreadCount(unread);
    }, [notifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = useCallback(
        async (id: number) => {
            try {
                setNotifications(prev =>
                    prev.map(n => (n.ID === id ? { ...n, IsRead: true } : n))
                );

                await markAsReadUsecase.execute(id, token);
            } catch (err) {
                console.error('Mark as read error:', err);
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

    return {
        notifications,
        loading,
        error,
        unreadCount,
        fetchNotifications,
        markAsRead,
        formatDate,
    };
};
