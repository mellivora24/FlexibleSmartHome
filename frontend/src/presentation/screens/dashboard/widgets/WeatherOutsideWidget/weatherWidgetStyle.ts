import { ColorValue, StyleSheet } from "react-native";

export const weatherWidgetStyle = StyleSheet.create({
    container: {
        padding: 10,
        width: '50%',
        borderRadius: 14,
        minHeight: 118
    },
    weather: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
    },
    weatherIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        position: 'absolute',
        top: 0,
        right: 0
    },
    weatherIconContainer: {
        flex: 1,
    },
    temperatureText: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    conditionText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'left',
    },
    locationContainer: {
        marginTop: 16,
        flexDirection: 'row',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
    locationIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    locationText: {
        color: '#fff',
        fontSize: 16,
        paddingLeft: 6
    }
});

export const WeatherLinearGradient = {
    hot:  ["#E94E77", "#D68189"] as string[] | ColorValue[],
    normal: ["#0E75E4", "#5FA9FE"] as string[] | ColorValue[],
}