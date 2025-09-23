import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBarWidget } from '@components/TopBarWidget';
import { Device } from '@model/Device';
import { BACKGROUND } from '@theme/colors';
import { dashboardStyle } from './style/dashboardStyle';
import { ChartWidget } from './widgets/ChartWidget';
import { HumidityWidget } from './widgets/HumidityWidget';
import { RoomWidget } from './widgets/RoomWidget';
import { TemperatureWidget } from './widgets/TemperatureWidget';
import { WeatherOutsideWidget } from './widgets/WeatherOutsideWidget';

interface DashboardScreenProps {
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
    outsideTemperature = 0,
    outsideWeatherCondition = "sunny",
    outsideLocation = "default location",
    insideTemperature = 0,
    insideHumidity = 0,
    temperatureHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    humidityHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    devices = [],
    onDevicePress,
    onDeviceValueChange,
}) => {
    if (outsideWeatherCondition !== "sunny" && outsideWeatherCondition !== "cloudy" && outsideWeatherCondition !== "rainy") {
        throw new Error("Invalid weather condition");
    }

    const router = useRouter();

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{flex: 1 }}
        >
            <SafeAreaView style={dashboardStyle.container}>
                <TopBarWidget
                    username="Quyet Thanh"
                    isHavingNotification={false}
                    onAvatarPress={() => router.push('/add-on/account')}
                    onNotificationPress={() => router.push('/add-on/notification')}
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
