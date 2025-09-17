import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { gradientColors, humidityWidgetStyle } from "./humidityWidgetStyle";

interface HumidityWidgetProps {
    humidity?: number;
}

export const HumidityWidget: React.FC<HumidityWidgetProps> = ({
    humidity = 22,
}) => {
    const { t } = useTranslation();

    const gradient = humidity <= 80 ? gradientColors.cool : gradientColors.warm;

    return (
        <LinearGradient
            colors={gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={humidityWidgetStyle.container}
        >
            <Text style={humidityWidgetStyle.humidityTitle}>{t('dashboard.humidityWidget.title')}</Text>
            <Text style={humidityWidgetStyle.humidityValue}>{humidity}%</Text>
        </LinearGradient>
    );
};
