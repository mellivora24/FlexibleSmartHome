import { StyleSheet } from "react-native";

export const dashboardStyle = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    Section1: {
        width: '100%',
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flex: 1,
        marginLeft: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    Section2: {
        width: '100%',
        marginTop: 8,
    },
});
