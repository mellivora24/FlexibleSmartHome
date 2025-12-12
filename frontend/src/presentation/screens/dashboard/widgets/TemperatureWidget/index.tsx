import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { gradientColors, temperatureWidgetStyle } from "./temperatureWidgetStyle";

interface TemperatureWidgetProps {
    temperature?: number;
}

export const TemperatureWidget: React.FC<TemperatureWidgetProps> = ({
    temperature,
}) => {
    const { t } = useTranslation();

    const gradient = temperature <= 26 ? gradientColors.cool : gradientColors.warm;

    return (
        <LinearGradient
            colors={gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={temperatureWidgetStyle.container}
        >   
            <Text style={temperatureWidgetStyle.temperatureTitle}>{t('dashboard.temperatureWidget.title')}</Text>
            <Text style={temperatureWidgetStyle.temperatureValue}>{temperature ? `${temperature}` : '--'}°C</Text>
        </LinearGradient>
    );
};
