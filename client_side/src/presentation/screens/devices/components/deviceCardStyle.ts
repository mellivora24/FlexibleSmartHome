import { StyleSheet } from "react-native";

export const deviceCardStyle = StyleSheet.create({
    // Main Card - Liquid Glass Effect
    card: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 8,
        shadowColor: "#C084FC", // Purple light
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1.5,
        borderColor: "rgba(192, 132, 252, 0.3)", // Purple với transparency
    },

    // Status Badge
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "rgba(255, 255, 255, 0.2)", // White glass mờ hơn
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },

    statusText: {
        color: "#FFFFFF", // White
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    // Device Name
    deviceNameNew: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF", // White
        marginBottom: 16,
        letterSpacing: 0.3,
        textShadowColor: "rgba(168, 85, 247, 0.5)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    // Info Row
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)", // White glass mờ
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },

    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        // flex: 1,
    },

    infoIcon: {
        fontSize: 16,
        marginRight: 8,
        color: "#E9D5FF", // Light purple
        // flex: 1,
    },

    infoText: {
        color: "#FFFFFF", // White
        fontSize: 13,
        fontWeight: "500",
        marginRight: 4,
    },

    infoDivider: {
        width: 1,
        height: 20,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        marginHorizontal: 12,
    },

    // Running Time - Liquid Glass Highlight
    runningTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.15)", // White glass
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },

    runningTimeLabel: {
        color: "#E9D5FF", // Light purple
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    runningTimeValue: {
        color: "#FFFFFF", // White
        fontSize: 18,
        fontWeight: "700",
    },

    // Modal Overlay
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.49)", // Purple tinted overlay đậm hơn
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    // Expanded Card - Enhanced Liquid Glass
    expandedCard: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#C084FC",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 24,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },

    // Modal Header
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.2)",
    },

    modalTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "#FFFFFF", // White
        flex: 1,
        letterSpacing: 0.5,
        textShadowColor: "rgba(168, 85, 247, 0.5)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },

    closeButtonText: {
        color: "#FFFFFF", // White
        fontSize: 20,
        fontWeight: "600",
    },

    // Status Badge Large
    statusBadgeLarge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },

    statusDotLarge: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },

    statusTextLarge: {
        color: "#FFFFFF", // White
        fontSize: 16,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    // Details Container - Frosted Glass
    detailsContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.15)",
    },

    detailLabel: {
        color: "#E9D5FF", // Light purple
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
    },

    detailValue: {
        color: "#FFFFFF", // White
        fontSize: 14,
        fontWeight: "600",
        textAlign: "right",
        flex: 1,
    },

    // Data Section
    dataSection: {
        marginTop: 8,
    },

    dataSectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF", // White
        marginBottom: 16,
        letterSpacing: 0.5,
    },

    dataGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    dataCard: {
        backgroundColor: "rgba(255, 255, 255, 0.12)", // White glass
        borderRadius: 12,
        padding: 12,
        minWidth: "45%",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.25)",
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    dataKey: {
        color: "#E9D5FF", // Light purple
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },

    dataValue: {
        color: "#FFFFFF", // White
        fontSize: 18,
        fontWeight: "700",
    },

    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },

    deviceName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF", // White
    },

    previewContainer: {
        marginTop: 8,
    },

    deviceType: {
        color: "#E9D5FF", // Light purple
        fontSize: 14,
    },

    runningTime: {
        color: "#E9D5FF", // Light purple
        fontSize: 14,
    },

    detail: {
        color: "#FFFFFF", // White
        fontSize: 14,
        marginBottom: 8,
    },

    lastDataContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        borderWidth: 0.5,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },

    dataText: {
        color: "#FFFFFF", // White
        fontSize: 14,
        marginBottom: 4,
    },

    // Action Buttons - Liquid Glass Effect với màu tím
    actionButtonsContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },

    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },

    editButton: {
        backgroundColor: "rgba(168, 85, 247, 0.25)", // Purple glass
        borderColor: "rgba(192, 132, 252, 0.6)",
        shadowColor: "#A855F7",
    },

    deleteButton: {
        backgroundColor: "rgba(248, 113, 113, 0.25)", // Red glass
        borderColor: "rgba(252, 165, 165, 0.6)",
        shadowColor: "#F87171",
    },

    actionButtonIcon: {
        fontSize: 20,
        marginRight: 6,
    },

    editButtonIcon: {
        color: "#FFFFFF", // White icon
    },

    deleteButtonIcon: {
        color: "#FFFFFF", // White icon
    },

    actionButtonText: {
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.5,
        color: "#FFFFFF", // White text
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    editButtonText: {
        color: "#FFFFFF",
    },

    deleteButtonText: {
        color: "#FFFFFF",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(168, 85, 247, 0.9)", // Purple glass
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: "rgba(192, 132, 252, 0.6)",
    },

    fabIcon: {
        fontSize: 28,
        color: "#FFFFFF",
        fontWeight: "700",
    },

    fabText: {
        fontSize: 10,
        color: "#E9D5FF",
        marginTop: 2,
        fontWeight: "600",
    },
});
