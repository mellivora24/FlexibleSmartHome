import { StyleSheet } from "react-native";

export const textFieldStyle = StyleSheet.create({
    container: {
        width: "80%",
        marginVertical: 8,
    },
    label: {
        fontSize: 18,
        marginBottom: 4,
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "rgba(135, 135, 142, 0.4)",
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
        resizeMode: "contain",
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 18,
        color: "#fff",
    },
});
