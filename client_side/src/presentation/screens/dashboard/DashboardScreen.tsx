import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBarWidget } from '@components/TopBarWidget';
import { BACKGROUND } from '@theme/colors';
import { dashboardStyle } from './style/dashboardStyle';
import { ChartWidget } from './widgets/ChartWidget';
import { HumidityWidget } from './widgets/HumidityWidget';
import { RoomWidget } from './widgets/RoomWidget';
import { TemperatureWidget } from './widgets/TemperatureWidget';
import { WeatherOutsideWidget } from './widgets/WeatherOutsideWidget';

import { Device } from '@src/domain/model/Device';
import { useAuthContext } from '@src/presentation/shared/hooks/useAuth';

export const DashboardScreen: React.FC = () => {
    const router = useRouter();
    const { authData } = useAuthContext();

    const [insideHumidity, setInsideHumidity] = useState(60);
    const [insideTemperature, setInsideTemperature] = useState(25);

    const [temperatureHistory, setTemperatureHistory] = useState<number[]>([22, 23, 24, 25, 26, 27, 28, 29, 30]);
    const [humidityHistory, setHumidityHistory] = useState<number[]>([55, 56, 57, 58, 59, 60, 61, 62, 63]);

    const [devices, setDevices] = useState<Device[]>([]);

    const handleDevicePress = (deviceId: number) => {
        console.log(`Device ${deviceId} pressed`);
    };

    const handleDeviceValueChange = (deviceId: number, newValue: number) => {
        console.log(`Device ${deviceId} changed to ${newValue}`);
    };

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={dashboardStyle.container}>
                {/* Top bar */}
                <TopBarWidget
                    username={authData?.name || "User"}
                    isHavingNotification={false}
                    onAvatarPress={() => router.push('/add-on/account')}
                    onNotificationPress={() => router.push('/add-on/notification')}
                />

                <View style={dashboardStyle.Section1}>
                    <WeatherOutsideWidget/>
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
                        onDevicePress={handleDevicePress}
                        onDeviceValueChange={handleDeviceValueChange}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};
