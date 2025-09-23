import { StyleSheet } from "react-native";

export const topBarWidgetStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    notificationIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
});
