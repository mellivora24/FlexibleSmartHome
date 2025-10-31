import { StyleSheet } from 'react-native';

export const tableStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: {
        borderRadius: 16,
        overflow: 'hidden'
    },
    headerRow: {
        backgroundColor: '#412180',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(192, 132, 252, 0.3)',
    },
    headerCell: {
        paddingVertical: 14,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.15)',
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    headerText: {
        fontWeight: '700',
        color: '#fff',
        fontSize: 13,
        textAlign: 'center',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(224, 224, 224, 0.3)',
        minHeight: 56,
    },
    evenRow: {
        backgroundColor: '#FFFFFF',
    },
    oddRow: {
        backgroundColor: '#F8F8FF',
    },
    cell: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        justifyContent: 'center',
        borderRightWidth: 0.5,
        borderRightColor: 'rgba(192, 132, 252, 0.2)',
    },
    cellText: {
        color: '#1a1a1a',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        margin: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(192, 132, 252, 0.3)',
    },
    emptyText: {
        color: '#412180',
        fontSize: 15,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    flatList: {
        width: '100%',
        maxHeight: '80%',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 16,
    },
    paginationButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#412180',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(192, 132, 252, 0.3)',
        shadowColor: '#C084FC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    paginationButtonDisabled: {
        backgroundColor: 'rgba(192, 192, 192, 0.3)',
        borderColor: 'rgba(192, 192, 192, 0.3)',
    },
    paginationButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    paginationButtonTextDisabled: {
        color: '#999',
    },
    paginationInfo: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(192, 132, 252, 0.3)',
    },
    paginationText: {
        color: '#412180',
        fontSize: 14,
        fontWeight: '600',
    },
});

export const columnStyles = StyleSheet.create({
    id: {
        fontWeight: '600',
        color: '#412180',
        fontSize: 12,
    },
    sensorName: {
        textAlign: 'left',
        paddingLeft: 8,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    value: {
        fontWeight: '700',
        color: '#412180',
        fontSize: 15,
    },
    unit: {
        color: '#666',
        fontStyle: 'italic',
        fontSize: 12,
    },
    createdAt: {
        fontSize: 11,
        color: '#555',
    },
});
