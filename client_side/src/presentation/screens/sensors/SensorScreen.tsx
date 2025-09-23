import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchWidget } from '@components/SearchWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { BACKGROUND } from '@theme/colors';
import { sensorScreenStyle } from './sensorScreenStyle';

export function SensorScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={sensorScreenStyle.container}>
                <TopBarWidget
                    username="Quyet Thanh"
                    isHavingNotification={false}
                    onAvatarPress={() => router.push('/add-on/account')}
                    onNotificationPress={() => router.push('/add-on/notification')}
                />

                <View style={sensorScreenStyle.body}>
                    <SearchWidget
                        placeholder="Search sensors..."
                        value=""
                        onChangeText={(text) => console.log(text)}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
