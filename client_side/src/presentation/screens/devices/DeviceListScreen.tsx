import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

import { TopBarWidget } from '@components/TopBarWidget';
import { Device } from '@src/domain/model/Device';
import { BACKGROUND } from '@theme/colors';
import { DeviceCard } from './components/DeviceCard';
import { deviceScreenStyle } from './deviceStyle';

interface DeviceScreenProps {
    devices?: Device[];
    loading?: boolean;
}

export default function DeviceListScreen({
    devices,
    loading,
}: DeviceScreenProps) {
    const router = useRouter();
    const { t } = useTranslation();

    const renderShimmer = () => (
        <>
            {[...Array(5)].map((_, idx) => (
                <ShimmerPlaceholder
                    key={idx}
                    LinearGradient={LinearGradient}
                    visible={false}
                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                    style={deviceScreenStyle.shimmerItem}
                />
            ))}
        </>
    );

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={deviceScreenStyle.container}>
                <TopBarWidget
                    username="Quyet Thanh"
                    isHavingNotification={false}
                    onAvatarPress={() => router.push('/add-on/account')}
                    onNotificationPress={() => router.push('/add-on/notification')}
                />
                <View style={deviceScreenStyle.body}>
                    <ScrollView
                        style={deviceScreenStyle.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 16 }}
                    >
                        {loading ? (
                            renderShimmer()
                        ) : devices && devices.length > 0 ? (
                            devices.map((device) => (
                                <DeviceCard key={device.id} device={device} />
                            ))
                        ) : (
                            <View style={deviceScreenStyle.noDeviceContainer}>
                                <Text style={deviceScreenStyle.noDeviceContext}>
                                    {t('deviceList.noDevice')}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
