import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { ICONS } from '@constants/images';
import { Device } from '@domain/entities/Device';
import { CustomSlider } from './slider';
import { styles } from './style';

interface DeviceCardProps {
    device: Device;
}

function renderCardContent(
    name: Device['name'],
    type: Device['type'],
    status: Device['status'],
    data: Device['Data'],
    t: (key: string) => string
) {
    function onValueChange(value: number) {
        console.log('Slider value changed to:', value);
    }

    return (
        <View>
            <View style={styles.section_header}>
                <Text style={styles.deviceName}>{name}</Text>
                <View style={status ? styles.connectedStatus : styles.disconnectedStatus} />
            </View>
            <View style={styles.section_body}>
                <CustomSlider
                    onValueChange={onValueChange}
                />
            </View>
            {status ? (
                <TouchableOpacity style={styles.section_footer} activeOpacity={0.7}>
                    <Image source={ICONS.CARD_TAP} style={styles.tipIcon} />
                    <Text style={styles.tips}>{t('dashboard.tips.tapToControl')}</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const { t } = useTranslation();
    return (
        <View style={styles.card}>
            {renderCardContent(device.name, device.type, device.status, device.Data, t)}
        </View>
    );
};
