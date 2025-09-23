import { Device } from "@model/Device";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { deviceCardStyle } from "./deviceCardStyle";

interface DeviceCardProps {
    device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const handleClose = () => setExpanded(false);

    let roomName;
    switch (device.rid) {
        case 1:
            roomName = t("dashboard.roomTabBar.livingRoom");
            break;
        case 2:
            roomName = t("dashboard.roomTabBar.bedRoom");
            break;
        case 3:
            roomName = t("dashboard.roomTabBar.kitchen");
            break;
        default:
            roomName = "Unknown Room";
    };

    return (
        <View>
            <TouchableOpacity
                style={deviceCardStyle.card}
                onLongPress={() => setExpanded(true)}
                delayLongPress={400}
            >
                <View style={deviceCardStyle.statusContainer}>
                    <View
                        style={[
                            deviceCardStyle.statusIndicator,
                            { backgroundColor: device.status ? "green" : "red" },
                        ]}
                    />
                    <Text style={deviceCardStyle.deviceName}>{device.name}</Text>
                </View>
                <View style={deviceCardStyle.previewContainer}>
                    <Text style={deviceCardStyle.deviceType}>{t(`deviceCard.type.${device.type}`)} | {roomName}</Text>
                    <Text style={deviceCardStyle.runningTime}>
                        {t("deviceCard.runningTime")}: {(device.RunningTime / 3600).toFixed(1)}h
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal visible={expanded} transparent animationType="fade">
            <Pressable style={deviceCardStyle.overlay} onPress={handleClose}>
                <View style={deviceCardStyle.expandedCard}>
                    <Text style={deviceCardStyle.deviceName}>{device.name}</Text>
                    <Text></Text>
                    <Text style={deviceCardStyle.detail}>
                        {t("deviceCard.port")}: {device.port} | {t(`deviceCard.type.${device.type}`)}
                    </Text>
                    <Text style={deviceCardStyle.detail}>
                        {t("deviceCard.room")}: {roomName}
                    </Text>
                    <Text style={deviceCardStyle.detail}>
                        {t("deviceCard.status.status")}:{" "}
                        {device.status
                        ? t("deviceCard.status.online")
                        : t("deviceCard.status.offline")}
                    </Text>
                    <Text style={deviceCardStyle.detail}>
                        {t("deviceCard.runningTime")}: {(device.RunningTime / 3600).toFixed(1)}h
                    </Text>
                    <Text style={deviceCardStyle.detail}>
                        {t("deviceCard.lastUpdated")}: {device.UpdatedAt.toLocaleDateString()}
                    </Text>

                    <Text></Text>
                    <Text style={deviceCardStyle.detail}>{t("deviceCard.lastData")}:</Text>
                    <View style={deviceCardStyle.lastDataContainer}>
                        {Object.entries(device.Data).map(([key, value]) => (
                            <Text key={key} style={deviceCardStyle.dataText}>
                                {key}: {value.toString()}
                            </Text>
                        ))}
                    </View>
                </View>
            </Pressable>
            </Modal>
        </View>
    );
};
