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

    useEffect(() => {
        setDeviceData(device.Data);
    }, [device.Data]);

    useEffect(() => {
        if (!lastResponse) return;

        setDeviceData((prev) => {
            const normalizedValue = typeof lastResponse.value === "number"
                ? lastResponse.value
                : Number(lastResponse.value) || prev.value;

            return {
                ...prev,
                value: normalizedValue,
                ...(typeof lastResponse.status === "boolean" && {
                    status: lastResponse.status
                })
            };
        });
    }, [lastResponse]);

    const handlePress = () => {
        const nextCommand = deviceData.status ? "off" : "on";
        sendControl(nextCommand);
    };

    const handleValueChange = (value: number) => {
        sendControl("set", value);
    };

    const CardWrapper = device.type === "digitalDevice" ? TouchableOpacity : View;

    return (
        <View style={styles.card}>
            <CardWrapper disabled={isControlling} onPress={handlePress}>
                <View style={styles.section_header}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                </View>

                <View style={styles.section_body}>
                    {device.type === "analogDevice" && (
                        <CustomSlider
                            initialValue={deviceData.value ?? 0}
                            onValueChange={handleValueChange}
                        />
                    )}

                    {device.type === "analogSensor" && (
                        <Gauge value={deviceData.value ?? 0} size={130} />
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
                                    deviceData.value === 0
                                        ? styles.digitalSensorHigh
                                        : styles.digitalSensorLow
                                }
                            />
                        </View>
                    )}
                </View>

                {device.type === "digitalDevice" && (
                    <View style={[styles.section_footer, { marginTop: 12 }]}>
                        <Image source={ICONS.CARD_TAP} style={styles.tipIcon} />
                        <Text style={styles.tips}>{t("dashboard.tips.tapToControl")}</Text>
                    </View>
                )}
            </CardWrapper>

            {isControlling && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#00bcd4" />
                </View>
            )}
        </View>
    );
};
