import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

import { TopBarWidget } from '@components/TopBarWidget';
import { useDevicesViewModel } from '@presentation/hooks/useDevicesViewModel';
import { useAuthContext } from '@src/presentation/hooks/useAppContext';
import { BACKGROUND } from '@theme/colors';
import { AddModalComponent } from './components/addModal/AddModal';
import { DeviceCard } from './components/deviceCard/DeviceCard';
import { FloatingActionButton } from './components/FloatButton';
import { deviceScreenStyle } from './deviceStyle';

export const DeviceScreen: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const {
        loading: vmLoading,
        devices: vmDevices,
        openModal: vmOpenModal,
        setOpenModalState: setVmOpenModal,
        handleEditDevice,
        handleDeleteDevice,
        handleCreateDevice,
    } = useDevicesViewModel();

    const { authData } = useAuthContext();

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
                        {vmLoading ? (
                            renderShimmer()
                        ) : vmDevices.length > 0 ? (
                            vmDevices.map((device) => (
                                <DeviceCard
                                    key={device.id}
                                    device={device}
                                    onEdit={handleEditDevice}
                                    onDelete={handleDeleteDevice}
                                />
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

                { vmOpenModal && (
                    <AddModalComponent
                        visible={vmOpenModal}
                        onClose={() => setVmOpenModal(false)}
                        onSave={handleCreateDevice}
                        availablePorts={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
                    />
                )}
            </SafeAreaView>

            <FloatingActionButton onPress={() => setVmOpenModal(true)} />
        </LinearGradient>
    );
}
