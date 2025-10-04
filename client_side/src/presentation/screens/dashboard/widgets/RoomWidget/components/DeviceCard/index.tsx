import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { ICONS, IMAGES } from "@constants/images";
import { Device, DeviceData } from "@domain/model/Device";
import { Gauge } from "./gauge";
import { CustomSlider } from "./slider";
import { styles } from "./style";

function isAnalogSensor(data: DeviceData): data is { value: number; unit?: string } {
    return "value" in data;
}
function isAnalogDevice(data: DeviceData): data is { onOff: boolean; pwm: number; unit?: string } {
    return "pwm" in data;
}
function isDigitalSensor(data: DeviceData): data is { signal: boolean } {
    return "signal" in data;
}
function isDigitalDevice(data: DeviceData): data is { onOff: boolean } {
    return "onOff" in data && !("pwm" in data);
}

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
    const Wrapper = type === "digitalDevice" || type === "analogDevice" ? TouchableOpacity : View;

    return (
        <Wrapper onPress={onPress}>
            {/* Header */}
            <View style={styles.section_header}>
                <Text style={styles.deviceName}>{name}</Text>
                <View style={status ? styles.connectedStatus : styles.disconnectedStatus} />
            </View>

            {/* Body */}
            <View style={styles.section_body}>
                {isAnalogDevice(data) && <CustomSlider onValueChange={onValueChange} />}
                {isAnalogSensor(data) && <Gauge value={data.value ?? 0} size={150} />}
                {isDigitalDevice(data) && (
                    <Image
                        source={ data.onOff ? IMAGES.PUB_LIGHT_ON : IMAGES.PUB_LIGHT_OFF}
                        style={{ width: 100, height: 100, resizeMode: "contain", marginTop: 24 }}
                    />
                )}
                {isDigitalSensor(data) && (
                    <View style={styles.digitalSensor}>
                        <View style={data.signal ? styles.digitalSensorHigh : styles.digitalSensorLow}/>
                        <Text style={styles.digitalSensorText}>
                            {data.signal ? t("dashboard.status.high") : t("dashboard.status.low")}
                        </Text>
                    </View>
                )}
            </View>

            {/* Footer */}
            {status && isDigitalDevice(data) && (
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
    onPress?: (device: Device) => void;
    onValueChange?: (value: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, onValueChange }) => {
    const { t } = useTranslation();

    const handlePress = () => {
        if (onPress) onPress(device);
    }

    const handleValueChange = (value: number) => {
        if (onValueChange) onValueChange(value);
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
