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

export default function DashboardScreen() {
    const mockDevices: Device[] = [
        {
            id: 1,
            uid: 101,
            mid: 501,
            rid: 0,
            name: 'Living Room Light',
            type: 'digitalDevice',
            port: 1,
            status: true,
            Data: { onOff: false },
            RunningTime: 3600,
            CreatedAt: new Date('2025-09-01T10:00:00Z'),
            UpdatedAt: new Date('2025-09-18T08:00:00Z'),
        },
        {
            id: 2,
            uid: 102,
            mid: 502,
            rid: 0,
            name: 'Bedroom Fan',
            type: 'analogDevice',
            port: 2,
            status: false,
            Data: { onOff: true, pwm: 75, unit: '%' },
            RunningTime: 7200,
            CreatedAt: new Date('2025-09-02T09:30:00Z'),
            UpdatedAt: new Date('2025-09-18T07:45:00Z'),
        },
        {
            id: 3,
            uid: 103,
            mid: 503,
            rid: 0,
            name: 'Kitchen Heater',
            type: 'analogSensor',
            port: 3,
            status: true,
            Data: { value: 80, unit: '°C' },
            RunningTime: 5400,
            CreatedAt: new Date('2025-09-05T12:00:00Z'),
            UpdatedAt: new Date('2025-09-18T07:50:00Z'),
        },
        {
            id: 4,
            uid: 104,
            mid: 504,
            rid: 0,
            name: 'Air Purifier',
            type: 'digitalSensor',
            port: 4,
            status: true,
            Data: { signal: false },
            RunningTime: 1800,
            CreatedAt: new Date('2025-09-10T14:00:00Z'),
            UpdatedAt: new Date('2025-09-18T07:55:00Z'),
        },
    ];

    function onAvatarPress() {
        console.log('Avatar pressed');
    }
    
    function onNotificationPress() {
        console.log('Notification pressed');
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
                    username="Quyet Thanh"
                    isHavingNotification={false}
                    onAvatarPress={onAvatarPress}
                    onNotificationPress={onNotificationPress}
                />
                <View style={dashboardStyle.Section1}>
                    <WeatherOutsideWidget />
                    <View style={dashboardStyle.row}>
                        <HumidityWidget humidity={70} />
                        <TemperatureWidget temperature={30} />
                    </View>
                </View>
                <View style={dashboardStyle.Section2}>
                    <ChartWidget
                        temperature={[28, 24, 26, 28, 30, 29, 27, 25, 32]}
                        humidity={[80, 62, 65, 70, 75, 73, 80, 68, 90]}
                    />
                </View>
                <View style={dashboardStyle.Section3}>
                    <RoomWidget
                        devices={mockDevices}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
