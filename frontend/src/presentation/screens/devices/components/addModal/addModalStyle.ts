import { StyleSheet } from "react-native";

export const addModalStyle = StyleSheet.create({
    // Modal Overlay
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.49)",
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
        color: "#FFFFFF",
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
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },

    // Form Container
    formContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },

    // Form Row
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.15)",
    },

    lastFormRow: {
        borderBottomWidth: 0,
    },

    formLabel: {
        color: "#E9D5FF",
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
        minWidth: 80,
    },

    formValue: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "right",
        flex: 1,
    },

    // Text Input
    textInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
        marginLeft: 10,
        minHeight: 40,
    },

    // Dropdown Container
    dropdownContainer: {
        flex: 1,
        marginLeft: 10,
        minWidth: 150,
    },

    dropdownStyle: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.2)',
        minHeight: 40,
    },

    dropdownTextStyle: {
        color: '#FFF',
        fontSize: 14,
    },

    dropdownListContainer: {
        backgroundColor: '#2B275D',
        borderColor: 'rgba(255,255,255,0.2)',
    },

    dropdownListItemLabel: {
        color: '#FFF',
        fontSize: 14,
    },

    dropdownSelectedItemLabel: {
        color: '#4ADE80',
        fontWeight: '600',
    },

    // Error Message
    errorText: {
        color: '#F87171',
        fontSize: 14,
        fontWeight: "600",
        textAlign: 'right',
        flex: 1,
    },

    // Save Button
    saveButton: {
        marginTop: 16,
        backgroundColor: "#22C55E",
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.6)",
        shadowColor: "#22C55E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    saveButtonDisabled: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255, 255, 255, 0.3)",
        shadowOpacity: 0.1,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 0.5,
    },

    saveButtonIcon: {
        fontSize: 18,
        color: "#FFFFFF",
        marginRight: 8,
    },

    // Spacer
    spacer: {
        minWidth: "93.5%",
        height: 1,
    },

    // Helper Text
    helperText: {
        color: "#E9D5FF",
        fontSize: 12,
        fontStyle: "italic",
        marginTop: 4,
        opacity: 0.8,
    },

    requiredIndicator: {
        color: "#F87171",
        fontSize: 14,
        fontWeight: "700",
        marginLeft: 4,
    },
});
