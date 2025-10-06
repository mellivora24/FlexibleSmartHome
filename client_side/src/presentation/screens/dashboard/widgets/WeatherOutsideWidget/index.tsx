import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Text, View } from "react-native";

import { ICONS } from "@constants/images";
import { useWeatherViewModel } from "./WeatherViewModel";
import { WeatherLinearGradient, weatherWidgetStyle } from "./weatherWidgetStyle";

const getWeatherByWMO = (code: number, t: any) => {
    if (code === undefined || code === null) {
        return {
            condition: t("dashboard.weatherCondition.unknown"),
            icon: ICONS.DASHBOARD_SUNNY,
        };
    }

    if ([0, 1].includes(code))
        return { condition: t("dashboard.weatherCondition.sunny"), icon: ICONS.DASHBOARD_SUNNY };

    if ([2, 3, 45, 48].includes(code))
        return { condition: t("dashboard.weatherCondition.cloudy"), icon: ICONS.DASHBOARD_CLOUDY };

    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(code)) {
        return { condition: t("dashboard.weatherCondition.rainy"), icon: ICONS.DASHBOARD_RAINY };
    }
    
    return { condition: t("dashboard.weatherCondition.unknown"), icon: ICONS.DASHBOARD_SUNNY };
};

export const WeatherOutsideWidget: React.FC = () => {
    const { t } = useTranslation();
    const { weather, loading, error, fetchWeather } = useWeatherViewModel();

    const location = "Hà Nội, VN";
    const latitude = 21.028511;
    const longitude = 105.804817;

    useEffect(() => {
        fetchWeather(latitude, longitude);
    }, []);

    const { condition, icon } = getWeatherByWMO(weather?.weathercode ?? 0, t);

    const linearColor =
        weather?.temperature && weather?.temperature >= 30
            ? WeatherLinearGradient.hot
            : WeatherLinearGradient.normal;

    return (
        <LinearGradient
            colors={linearColor as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={weatherWidgetStyle.container}
        >
            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={{ alignSelf: "center", marginTop: 32 }} />
            ) : (
                <>
                    <View style={weatherWidgetStyle.weather}>
                        <View>
                            <Text style={weatherWidgetStyle.temperatureText}>
                                {weather?.temperature !== undefined ? `${weather?.temperature}°C` : "--"}
                            </Text>
                            <Text style={weatherWidgetStyle.conditionText}>{condition}</Text>
                        </View>
                        <View style={weatherWidgetStyle.weatherIconContainer}>
                            <Image source={icon} style={weatherWidgetStyle.weatherIcon} />
                        </View>
                    </View>

                    <View style={weatherWidgetStyle.locationContainer}>
                        <Image
                            source={ICONS.DASHBOARD_LOCATION}
                            style={weatherWidgetStyle.locationIcon}
                        />
                        <Text style={weatherWidgetStyle.locationText}>{location}</Text>
                    </View>

                    {error && <Text style={{ color: "red", marginTop: 4 }}>{error}</Text>}
                </>
            )}
        </LinearGradient>
    );
};
