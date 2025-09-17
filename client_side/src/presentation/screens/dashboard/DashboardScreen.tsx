import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBarWidget } from '@components/TopBarWidget';
import { BACKGROUND } from '@theme/colors';
import { dashboardStyle } from './style/dashboardStyle';
import { ChartWidget } from './widgets/ChartWidget';
import { HumidityWidget } from './widgets/HumidityWidget';
import { TemperatureWidget } from './widgets/TemperatureWidget';
import { WeatherOutsideWidget } from './widgets/WeatherOutsideWidget';

export default function DashboardScreen() {
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
                    isHavingNotification={true}
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
            </SafeAreaView>
        </LinearGradient>
    );
}
