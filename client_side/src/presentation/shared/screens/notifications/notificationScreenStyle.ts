import { StyleSheet } from 'react-native';

export const notificationScreenStyle = StyleSheet.create({
    // Main Container
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#F5F3FF',
        letterSpacing: 0.5,
    },

    unreadBadge: {
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.5)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },

    unreadBadgeText: {
        color: '#F5F3FF',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },

    // Center Container (Loading, Empty, Error States)
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    loadingText: {
        marginTop: 16,
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
    },

    emptyIcon: {
        width: 100,
        height: 100,
        marginBottom: 24,
        opacity: 0.4,
    },

    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },

    emptyMessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Error State
    errorTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },

    errorMessage: {
        fontSize: 14,
        color: '#EF4444',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },

    retryButton: {
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.5)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },

    retryButtonText: {
        color: '#F5F3FF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    // ScrollView & List
    scrollView: {
        flex: 1,
    },

    notificationsList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    // Notification Item
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.3)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'flex-start',
        overflow: 'hidden',
    },

    notificationItemUnread: {
        backgroundColor: 'rgba(168, 85, 247, 0.25)',
        borderColor: 'rgba(192, 132, 252, 0.5)',
        shadowOpacity: 0.25,
    },

    lastItem: {
        marginBottom: 20,
    },

    // Unread Indicator
    unreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#84CC16',
        marginRight: 12,
        marginTop: 6,
        shadowColor: '#84CC16',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },

    // Content Container
    contentContainer: {
        flex: 1,
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },

    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F5F3FF',
        flex: 1,
        marginRight: 8,
        letterSpacing: 0.2,
    },

    titleBold: {
        fontWeight: '700',
        color: '#FFFFFF',
    },

    timeText: {
        fontSize: 12,
        color: '#D8BFD8',
        fontWeight: '500',
    },

    // Message
    notificationMessage: {
        fontSize: 14,
        color: '#E9D5FF',
        lineHeight: 20,
        marginBottom: 12,
    },

    // Meta Info
    metaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(192, 132, 252, 0.2)',
        gap: 8,
    },

    readBadge: {
        backgroundColor: 'rgba(168, 85, 247, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.5)',
    },

    readBadgeText: {
        fontSize: 11,
        color: '#E9D5FF',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },

    markReadButton: {
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 'auto',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.4)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },

    markReadButtonText: {
        fontSize: 11,
        color: '#F5F3FF',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
});
