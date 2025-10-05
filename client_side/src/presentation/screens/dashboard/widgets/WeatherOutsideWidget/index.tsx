import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

import { ICONS } from "@constants/images";
import { WeatherLinearGradient, weatherWidgetStyle } from "./weatherWidgetStyle";

interface WeatherOutsideWidgetProps {
    temperature?: number;
    weatherCode?: number;
    location?: string;
}

export const WeatherOutsideWidget: React.FC<WeatherOutsideWidgetProps> = ({
    temperature,
    weatherCode,
    location,
}) => {
    const { t } = useTranslation();

    let weatherCondition = "";
    let weatherIcon = ICONS.DASHBOARD_SUNNY;

    if (weatherCode !== undefined) {
        if ([0].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.sunny');
            weatherIcon = ICONS.DASHBOARD_SUNNY;
        } else if ([1, 2, 3].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.partlyCloudy');
            weatherIcon = ICONS.DASHBOARD_PARTLY_CLOUDY;
        } else if ([45, 48].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.fog');
            weatherIcon = ICONS.DASHBOARD_FOG;
        } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.drizzle');
            weatherIcon = ICONS.DASHBOARD_DRIZZLE;
        } else if ([61, 63, 65, 66, 67].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.rain');
            weatherIcon = ICONS.DASHBOARD_RAINY;
        } else if ([71, 73, 75, 77].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.snow');
            weatherIcon = ICONS.DASHBOARD_SNOW;
        } else if ([80, 81, 82].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.shower');
            weatherIcon = ICONS.DASHBOARD_RAINY;
        } else if ([95, 96, 99].includes(weatherCode)) {
            weatherCondition = t('dashboard.weatherCondition.thunderstorm');
            weatherIcon = ICONS.DASHBOARD_THUNDER;
        } else {
            weatherCondition = t('dashboard.weatherCondition.unknown');
            weatherIcon = ICONS.DASHBOARD_CLOUDY;
        }
    }

    const linearColor =
        temperature && temperature >= 25
            ? WeatherLinearGradient.hot
            : WeatherLinearGradient.normal;

    return (
        <LinearGradient
            colors={linearColor as [string, string]}
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
                    <Image source={weatherIcon} style={weatherWidgetStyle.weatherIcon} />
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
};
// MÃ WMO THAM KHẢO: https://open-meteo.com/en/docs#latitude=10.82&longitude=106.63&hourly=temperature_2m