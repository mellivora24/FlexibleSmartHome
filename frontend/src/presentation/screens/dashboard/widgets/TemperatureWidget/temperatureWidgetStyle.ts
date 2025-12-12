import { StyleSheet } from "react-native";

export const temperatureWidgetStyle = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 8,
    },
    temperatureTitle: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    temperatureValue: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'right',
    },
});

export const gradientColors = {
    cool: ['#2E89EE', '#96C4F7'],
    warm: ['#F5A623', '#D0021B'],
}