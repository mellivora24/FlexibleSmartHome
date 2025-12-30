import { IMAGES } from '@constants/images';
import { useNotificationContext } from '@hooks/NotificationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notificationScreenStyle } from './notificationScreenStyle';

const GRADIENT = ['#412180', '#2B275D', '#030912'] as string[];

export const NotificationScreen: React.FC = () => {
    const {
        notifications,
        loading,
        error,
        unreadCount,
        markAsRead,
        fetchNotifications,
        formatDate,
    } = useNotificationContext();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchNotifications();
        } finally {
            setRefreshing(false);
        }
    }, [fetchNotifications]);

    const handleNotificationPress = useCallback(
        (id: number) => markAsRead(id),
        [markAsRead]
    );
    
    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [fetchNotifications])
    );

    if (error && !loading) {
        return (
            <LinearGradient
                colors={GRADIENT as [string, string, string]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={notificationScreenStyle.container} edges={['top']}>
                    <View style={notificationScreenStyle.centerContainer}>
                        <Text style={notificationScreenStyle.errorTitle}>
                            Oops! Something went wrong
                        </Text>
                        <Text style={notificationScreenStyle.errorMessage}>{error}</Text>
                        <TouchableOpacity
                            style={notificationScreenStyle.retryButton}
                            onPress={() => fetchNotifications()}
                        >
                            <Text style={notificationScreenStyle.retryButtonText}>
                                Try Again
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (loading) {
        return (
            <LinearGradient
                colors={GRADIENT as [string, string, string]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={notificationScreenStyle.container} edges={['top']}>
                    <View style={notificationScreenStyle.centerContainer}>
                        <ActivityIndicator size="large" color="#A855F7" />
                        <Text style={notificationScreenStyle.loadingText}>
                            Loading notifications...
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (notifications.length === 0) {
        return (
            <LinearGradient
                colors={GRADIENT as [string, string, string]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.8, y: 0 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={notificationScreenStyle.container} edges={['top']}>
                    <View style={notificationScreenStyle.centerContainer}>
                        <Image
                            source={IMAGES.LOGO}
                            style={notificationScreenStyle.emptyIcon}
                        />
                        <Text style={notificationScreenStyle.emptyTitle}>
                            No Notifications Yet
                        </Text>
                        <Text style={notificationScreenStyle.emptyMessage}>
                            You're all caught up! Check back later for updates.
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={GRADIENT as [string, string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={notificationScreenStyle.container} edges={['top']}>
                <ScrollView
                    style={notificationScreenStyle.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#A855F7"
                            colors={['#A855F7', '#C084FC']}
                        />
                    }
                >
                    <View style={notificationScreenStyle.notificationsList}>
                        {notifications.map((notification, index) => (
                            <NotificationItem
                                key={`notification-${notification.ID}`}
                                notification={notification}
                                isLast={index === notifications.length - 1}
                                onPress={() => handleNotificationPress(notification.ID)}
                                formatDate={formatDate}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

interface NotificationItemProps {
    notification: any;
    isLast: boolean;
    onPress: () => void;
    formatDate: (date: string) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    isLast,
    onPress,
    formatDate,
}) => {
    const isUnread = !notification.IsRead;

    return (
        <View
            style={[
                notificationScreenStyle.notificationItem,
                isUnread && notificationScreenStyle.notificationItemUnread,
                isLast && notificationScreenStyle.lastItem,
            ]}
        >
            {isUnread && (
                <View style={notificationScreenStyle.unreadIndicator} />
            )}

            <View style={notificationScreenStyle.contentContainer}>
                <View style={notificationScreenStyle.titleRow}>
                    <Text
                        style={[
                            notificationScreenStyle.notificationTitle,
                            isUnread && notificationScreenStyle.titleBold,
                        ]}
                        numberOfLines={1}
                    >
                        {notification.Title}
                    </Text>
                    <Text style={notificationScreenStyle.timeText}>
                        {formatDate(notification.CreatedAt)}
                    </Text>
                </View>

                <Text
                    style={notificationScreenStyle.notificationMessage}
                    numberOfLines={2}
                >
                    {notification.Message}
                </Text>

                <View style={notificationScreenStyle.metaInfo}>
                    {isUnread && (
                        <>
                            <View style={notificationScreenStyle.readBadge}>
                                <Text style={notificationScreenStyle.readBadgeText}>
                                    Mới
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={notificationScreenStyle.markReadButton}
                                onPress={onPress}
                            >
                                <Text style={notificationScreenStyle.markReadButtonText}>
                                    Đánh dấu đã đọc
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};
