import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

import { ICONS } from "@constants/images";
import { Device, DeviceData } from "@domain/model/Device";
import { useDeviceControl } from "@hooks/useDeviceControl";
import { Gauge } from "./gauge";
import { CustomSlider } from "./slider";
import { styles } from "./style";

export const DeviceCard: React.FC<{ device: Device }> = ({ device }) => {
    const { t } = useTranslation();
    const { sendControl, isControlling, lastResponse } = useDeviceControl(device.id);

    const [deviceData, setDeviceData] = useState<DeviceData>(device.Data);
    const [deviceStatus, setDeviceStatus] = useState<boolean>(device.status);

    useEffect(() => {
    if (!lastResponse) return;

    setDeviceData((prev) => ({
        ...prev,
        value: Number(lastResponse.value ?? prev.value),
        status:
        typeof lastResponse.status === "boolean"
            ? lastResponse.status
            : lastResponse.command === "on"
            ? true
            : lastResponse.command === "off"
                ? false
                : prev.status,
    }));
    }, [lastResponse]);

    const handlePress = () => {
        const nextCommand = deviceData.status ? "off" : "on";
        sendControl(nextCommand);
    };

    const handleValueChange = (value: number) => {
        sendControl("set", value);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handlePress} disabled={isControlling}>
                {/* Header */}
                <View style={styles.section_header}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                </View>

                {/* Body */}
                <View style={styles.section_body}>
                    {device.type === "analogDevice" && (
                        <CustomSlider onValueChange={handleValueChange} />
                    )}

                    {device.type === "analogSensor" && (
                        <Gauge value={deviceData.value ?? 0} size={150} />
                    )}

                    {device.type === "digitalDevice" && (
                        <View
                            style={
                                deviceData.status
                                    ? styles.digitalSensorLow
                                    : styles.digitalSensorHigh
                            }
                        />
                    )}

                    {device.type === "digitalSensor" && (
                        <View style={styles.digitalSensor}>
                            <View
                                style={
                                    deviceData.status
                                        ? styles.digitalSensorHigh
                                        : styles.digitalSensorLow
                                }
                            />
                            <Text style={styles.digitalSensorText}>
                                {deviceData.status
                                    ? t("dashboard.status.high")
                                    : t("dashboard.status.low")}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Footer */}
                {device.type === "digitalDevice" && (
                    <View style={[styles.section_footer, { marginTop: 12 }]}>
                        <Image source={ICONS.CARD_TAP} style={styles.tipIcon} />
                        <Text style={styles.tips}>{t("dashboard.tips.tapToControl")}</Text>
                    </View>
                )}
            </TouchableOpacity>

            {isControlling && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#00bcd4" />
                </View>
            )}
        </View>
    );
};
