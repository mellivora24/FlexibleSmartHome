import { StyleSheet } from "react-native";

export const passwordTextFieldStyle = StyleSheet.create({
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
    hideButton: {
        width: 80,
        height: 52,
        marginLeft: 8,
        backgroundColor: "rgba(125, 57, 235, 0.8)",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    showButton: {
        width: 80,
        height: 52,
        marginLeft: 8,
        backgroundColor: "rgba(95, 95, 95, 0.8)",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    hideShowText: {
        color: "#fff",
        fontSize: 18,
    },
});
