import { StyleSheet } from "react-native";

export const deviceCardStyle = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 10,
        marginVertical: 8,
        backgroundColor: "#fff",
    },
    deviceName: {
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center",
    },
    statusContainer: {
        marginBottom: 4,
        flexDirection: "row",
        alignContent: 'center',
        justifyContent: 'flex-start',
    },
    statusIndicator: {
        width: 10,
        height: 10,
        marginRight: 8,
        borderRadius: 5,
        alignSelf: "center"
    },
    statusText: {
        fontSize: 14,
        color: "#333"
    },
    previewContainer: {
        marginTop: 4,
        marginLeft: 18,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    runningTime: {
        fontSize: 14,
        color: "#666"
    },
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    expandedCard: {
        width: "85%",
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    deviceType: {
        fontSize: 14,
        color: "#666"
    },
    detail: {
        fontSize: 14,
        marginTop: 4,
        color: "#333"
    },
    lastDataContainer: {
        padding: 8,
        backgroundColor: '#f0f0f0',
    },
    dataText: {
        fontSize: 14,
        color: '#333',
    },
});
