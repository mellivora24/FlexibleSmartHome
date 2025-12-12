import { StyleSheet } from "react-native";

export const topBarWidgetStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    notificationContainer: {

    },
    notificationCount: {
        color: 'white',
        backgroundColor: 'red',
        borderRadius: 12,
        width: 18,
        height: 18,
        textAlign: 'center',
        lineHeight: 18,
        position: 'absolute',
        top: -4,
        right: -4,
        zIndex: 1,
        fontWeight: 'bold', 
    },
    notificationIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
});
