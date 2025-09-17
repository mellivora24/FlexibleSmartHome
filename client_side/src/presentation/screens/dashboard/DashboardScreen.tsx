import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBarWidget } from '@components/TopBarWidget';
import { BACKGROUND } from '@theme/colors';
import { dashboardStyle } from './style/dashboardStyle';
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
                <WeatherOutsideWidget />
            </SafeAreaView>
        </LinearGradient>
    );
}
