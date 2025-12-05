import { StyleSheet } from "react-native";

export const sensorScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 35,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    body: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    tableContainer: {
        flex: 6,
        width: '100%',
        marginTop: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 12,
    },
    retryText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    infoContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    resultText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
        paddingBottom: 16,
    },
});
