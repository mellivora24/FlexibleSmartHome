import { StyleSheet } from "react-native";

export const topBarWidgetStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 18,
        justifyContent: 'space-between',
    },
    notificationIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
});
