import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated } from "react-native";

import { Device, UpdateDeviceRequest } from "@src/domain/model/Device";

export function useDeviceCard(
    device: Device,
    onEdit?: (deviceUpdate: UpdateDeviceRequest) => void,
    onDelete?: (deviceId: number) => void)
{
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(1));

    const handleClose = () => setExpanded(false);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handleEdit = (deviceUpdate: UpdateDeviceRequest) => {
        handleClose();
        onEdit?.(deviceUpdate);
    };

    const handleDelete = () => {
        handleClose();
        onDelete?.(device.id);
    };

    let roomName = "Phòng ";
    let roomIcon;
    switch (device.rid) {
        case 0:
            roomName += t("dashboard.roomTabBar.livingRoom");
            roomIcon = "🛋️";
            break;
        case 1:
            roomName += t("dashboard.roomTabBar.bedRoom");
            roomIcon = "🛏️";
            break;
        case 2:
            roomName += t("dashboard.roomTabBar.kitchen");
            roomIcon = "🍳";
            break;
        default:
            roomName = "Unknown Room";
            roomIcon = "📍";
    }

    const deviceTypeIcon = device.type === "digitalDevice" ? "⚡" : "📊";

    return ({
        expanded,
        scaleAnim,
        handleClose,
        handlePressIn,
        handlePressOut,
        handleEdit,
        handleDelete,
        setExpanded,
        roomName,
        roomIcon,
        deviceTypeIcon,
        t
    });
};
