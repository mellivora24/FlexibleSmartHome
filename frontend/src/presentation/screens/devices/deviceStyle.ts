import { StyleSheet } from "react-native";

export const deviceScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    body: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    scrollView: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#fff',
        fontWeight: '600',
        alignSelf: 'flex-start'
    },
    noDeviceContainer: {
        flex: 1,
        height: 700,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noDeviceContext: {
        fontSize: 16,
        color: '#fff',
    },
    shimmerItem: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#e0e0e0'
    },
    shimmerSmall: {
        width: '60%',
        height: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    shimmerMedium: {
        width: '80%',
        height: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    shimmerLarge: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
});