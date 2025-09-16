import { StyleSheet } from "react-native";

export const accountWidgetStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textView: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 16,
        color: '#fff',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});