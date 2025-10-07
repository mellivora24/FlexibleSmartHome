import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { ICONS } from "@constants/images";
import { Device, DeviceData } from "@domain/model/Device";
import { Gauge } from "./gauge";
import { CustomSlider } from "./slider";
import { styles } from "./style";

interface RenderCardProps {
    name: string;
    type: string;
    status: boolean;
    data: DeviceData;
    t: (key: string) => string;
    onPress?: () => void;
    onValueChange?: (value: number) => void;
}

function renderCardContent({
    name,
    type,
    status,
    data,
    t,
    onPress,
    onValueChange
}: RenderCardProps) {
    const Wrapper = type === "digitalDevice" || type === "analogDevice" ? (status ? TouchableOpacity : View) : View;

    return (
        <Wrapper onPress={onPress}>
            {/* Header */}
            <View style={styles.section_header}>
                <Text style={styles.deviceName}>{name}</Text>
                <View style={status ? styles.connectedStatus : styles.disconnectedStatus} />
            </View>

            {/* Body */}
            <View style={styles.section_body}>
                {type === "analogDevice" && <CustomSlider onValueChange={onValueChange} />}
                {type === "analogSensor" && <Gauge value={data.value ?? 0} size={150} />}
                {type === "digitalDevice" && <View style={ data.status ? styles.digitalSensorLow : styles.digitalSensorHigh } />}
                {type === "digitalSensor" && (
                    <View style={styles.digitalSensor}>
                        <View style={data.status ? styles.digitalSensorHigh : styles.digitalSensorLow}/>
                        <Text style={styles.digitalSensorText}>
                            {data.value ? t("dashboard.status.high") : t("dashboard.status.low")}
                        </Text>
                    </View>
                )}
            </View>

            {/* Footer */}
            {status && type === "digitalDevice" && (
                <View style={[styles.section_footer, { marginTop: 24 }]}>
                    <Image source={ICONS.CARD_TAP} style={styles.tipIcon} />
                    <Text style={styles.tips}>{t("dashboard.tips.tapToControl")}</Text>
                </View>
            )}
        </Wrapper>
    );
}

interface DeviceCardProps {
  device: Device;
  onPress?: (deviceId: number) => void;
  onValueChange?: (deviceId: number, value: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, onValueChange }) => {
    const { t } = useTranslation();

    const handlePress = () => {
    if (onPress) onPress(device.id);
    };

    const handleValueChange = (value: number) => {
    if (onValueChange) onValueChange(device.id, value);
    };

    return (
        <View style={styles.card}>
            {renderCardContent({
                name: device.name,
                type: device.type,
                status: device.status,
                data: device.Data,
                t,
                onPress: handlePress,
                onValueChange: handleValueChange
            })}
        </View>
    );
};
