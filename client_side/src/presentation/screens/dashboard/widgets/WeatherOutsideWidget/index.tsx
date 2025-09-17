import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

import { ICONS } from "@constants/images";
import { LinearGradientColors, weatherWidgetStyle } from "./weatherWidgetStyle";

interface WeatherOutsideWidgetProps {
    temperature?: number;
    weatherCondition?: string;
    location?: string;
}

export const WeatherOutsideWidget: React.FC<WeatherOutsideWidgetProps> = ({
    temperature = 25,
    weatherCondition = "sunny",
    location = "Ha Noi, Viet Nam",
}) => {
    let weatherIcon;
    const { t } = useTranslation();

    switch (weatherCondition.toLowerCase()) {
        case "sunny":
            weatherCondition = t('dashboard.weatherCondition.sunny')
            weatherIcon = ICONS.DASHBOARD_SUNNY;
            break;
        case "cloudy":
            weatherCondition = t('dashboard.weatherCondition.cloudy');
            weatherIcon = ICONS.DASHBOARD_CLOUDY;
            break;
        case "rainy":
            weatherCondition = t('dashboard.weatherCondition.rainy');
            weatherIcon = ICONS.DASHBOARD_RAINY;
            break;
        default:
            weatherCondition = t('dashboard.weatherCondition.sunny');
            weatherIcon = ICONS.DASHBOARD_SUNNY;
            break;
    }
    
    return (
        <LinearGradient
            colors={LinearGradientColors as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={weatherWidgetStyle.container}
        >
            <View style={weatherWidgetStyle.weather}>
                <View>
                    <Text style={weatherWidgetStyle.temperatureText}>{temperature}°C</Text>
                    <Text style={weatherWidgetStyle.conditionText}>{weatherCondition}</Text>
                </View>
                <View style={weatherWidgetStyle.weatherIconContainer}>
                    <Image
                        source={weatherIcon}
                        style={weatherWidgetStyle.weatherIcon}
                    />
                </View>
            </View>

            <View style={weatherWidgetStyle.locationContainer}>
                <Image
                    source={ICONS.DASHBOARD_LOCATION}
                    style={weatherWidgetStyle.locationIcon}
                />
                <Text style={weatherWidgetStyle.locationText}>{location}</Text>
            </View>
        </LinearGradient>
    );
}