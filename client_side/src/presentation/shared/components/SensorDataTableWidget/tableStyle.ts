import { StyleSheet } from 'react-native';

export const tableStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    table: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    headerRow: {
        backgroundColor: '#412180'
    },
    headerCell: {
        paddingVertical: 8,
        paddingHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 0.5,
        borderRightColor: 'rgba(255,255,255,0.3)',
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 2,
    },
    sortIcon: {
        color: '#fff',
        fontSize: 10,
        opacity: 0.8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    cell: {
        paddingVertical: 10,
        paddingHorizontal: 2,
        justifyContent: 'center',
        borderRightWidth: 0.5,
        borderRightColor: '#f0f0f0',
    },
    cellText: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        margin: 16,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    },
    flatList: {
        width: '100%',
        height: '90%',
    },
});

export const columnStyles = StyleSheet.create({
    id: {
        //
    },
    sensorName: {
        textAlign: 'left',
        paddingLeft: 4
    },
    value: {
        //
    },
    unit: {
        //
    },
    createdAt: {
        //
    },
});
