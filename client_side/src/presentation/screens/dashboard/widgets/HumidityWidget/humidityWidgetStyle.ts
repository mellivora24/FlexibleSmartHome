import { StyleSheet } from "react-native";

export const humidityWidgetStyle = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#4A90E2',
    },
    humidityTitle: {
        fontSize: 14,
        color: 'white',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    humidityValue: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'right',
    }
});

export const gradientColors = {
    cool: ['#0E75E4', '#00BCFF'],
    warm: ['#F5A623', '#D0021B'],
}