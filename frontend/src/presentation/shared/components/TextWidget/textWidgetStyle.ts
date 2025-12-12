import { StyleSheet } from "react-native";

export const textWidgetStyle = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#87878e85",
        overflow: "hidden",
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8,
        alignSelf: "center",
        resizeMode: "contain",
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
        alignSelf: "center",
        overflow: "hidden",
    },
});
