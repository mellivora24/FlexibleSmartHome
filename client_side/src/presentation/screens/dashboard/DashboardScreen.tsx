import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBarWidget } from '@components/TopBarWidget';
import { Device } from '@domain/entities/Device';
import { BACKGROUND } from '@theme/colors';
import { dashboardStyle } from './style/dashboardStyle';
import { ChartWidget } from './widgets/ChartWidget';
import { HumidityWidget } from './widgets/HumidityWidget';
import { RoomWidget } from './widgets/RoomWidget';
import { TemperatureWidget } from './widgets/TemperatureWidget';
import { WeatherOutsideWidget } from './widgets/WeatherOutsideWidget';

interface DashboardScreenProps {
    username?: string;
    isHavingNotification?: boolean;
    outsideTemperature?: number;
    outsideWeatherCondition?: string;
    outsideLocation?: string;
    insideTemperature?: number;
    insideHumidity?: number;
    temperatureHistory?: number[];
    humidityHistory?: number[];
    devices?: Device[];
    onAvatarPress?: () => void;
    onNotificationPress?: () => void;
    onDevicePress?: (deviceId: number) => void;
    onDeviceValueChange?: (deviceId: number, value: number) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
    username = "default user",
    isHavingNotification = false,
    outsideTemperature = 0,
    outsideWeatherCondition = "sunny",
    outsideLocation = "default location",
    insideTemperature = 0,
    insideHumidity = 0,
    temperatureHistory = [28, 24, 26, 28, 30, 29, 27, 25, 32],
    humidityHistory = [80, 62, 65, 70, 75, 73, 80, 68, 90],
    devices = [],
    onAvatarPress,
    onNotificationPress,
    onDevicePress,
    onDeviceValueChange,
}) => {
    if (outsideWeatherCondition !== "sunny" && outsideWeatherCondition !== "cloudy" && outsideWeatherCondition !== "rainy") {
        throw new Error("Invalid weather condition");
    }
    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={dashboardStyle.container}>
                <TopBarWidget
                    username={username}
                    isHavingNotification={isHavingNotification}
                    onAvatarPress={onAvatarPress}
                    onNotificationPress={onNotificationPress}
                />
                <View style={dashboardStyle.Section1}>
                    <WeatherOutsideWidget
                        temperature={outsideTemperature}
                        weatherCondition={outsideWeatherCondition}
                        location={outsideLocation}
                    />
                    <View style={dashboardStyle.row}>
                        <HumidityWidget humidity={insideHumidity} />
                        <TemperatureWidget temperature={insideTemperature} />
                    </View>
                </View>
                <View style={dashboardStyle.Section2}>
                    <ChartWidget
                        temperature={temperatureHistory}
                        humidity={humidityHistory}
                    />
                </View>
                <View style={dashboardStyle.Section3}>
                    <RoomWidget
                        devices={devices}
                        onDevicePress={onDevicePress}
                        onDeviceValueChange={onDeviceValueChange}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
