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
    }
});