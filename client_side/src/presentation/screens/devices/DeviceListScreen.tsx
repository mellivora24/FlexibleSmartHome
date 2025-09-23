import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBarWidget } from '@components/TopBarWidget';
import { Device } from '@model/Device';
import { BACKGROUND } from '@theme/colors';
import { DeviceCard } from './components/DeviceCard';
import { deviceScreenStyle } from './deviceStyle';

interface DeviceScreenProps {
    devices?: Device[];
}

export default function DeviceListScreen({
    devices=mockDevices
}: DeviceScreenProps) {
    const router = useRouter();
    const { t } = useTranslation();

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
                        {devices ? (
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


const mockDevice: Device = {
  id: 1,
  uid: 1,
  mid: 1,
  rid: 1,
  name: "Living Room Light",
  type: "digitalDevice",
  port: 3,
  status: true,
  Data: { onOff: true },
  RunningTime: 1200,
  CreatedAt: new Date(),
  UpdatedAt: new Date(),
};

const mockDevices: Device[] = [
  {
    id: 1,
    uid: 1,
    mid: 1,
    rid: 1,
    name: "Living Room Light",
    type: "digitalDevice",
    port: 3,
    status: true,
    Data: { onOff: true },
    RunningTime: 1200,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
  {
    id: 2,
    uid: 1,
    mid: 1,
    rid: 2,
    name: "Bedroom Thermostat",
    type: "analogDevice",
    port: 5,
    status: false,
    Data: { value: 22.5 },
    RunningTime: 3600,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
  {
    id: 3,
    uid: 1,
    mid: 1,
    rid: 3,
    name: "Kitchen Sensor",
    type: "analogSensor",
    port: 7,
    status: true,
    Data: { value: 75 },
    RunningTime: 5400,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
];
