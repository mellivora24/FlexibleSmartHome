import { Device } from "@src/domain/model/Device";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { deviceCardStyle } from "./deviceCardStyle";

const GRADIENT = ["#412180", "#2B275D", "#030912"];

interface DeviceCardProps {
    device: Device;
    onEdit?: (device: Device) => void;  // Callback khi bấm nút Sửa
    onDelete?: (device: Device) => void; // Callback khi bấm nút Xóa
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onEdit, onDelete }) => {
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

    const handleEdit = () => {
        handleClose();
        onEdit?.(device);
    };

    const handleDelete = () => {
        handleClose();
        onDelete?.(device);
    };

    let roomName;
    let roomIcon;
    switch (device.rid) {
        case 1:
            roomName = t("dashboard.roomTabBar.livingRoom");
            roomIcon = "🛋️";
            break;
        case 2:
            roomName = t("dashboard.roomTabBar.bedRoom");
            roomIcon = "🛏️";
            break;
        case 3:
            roomName = t("dashboard.roomTabBar.kitchen");
            roomIcon = "🍳";
            break;
        default:
            roomName = "Unknown Room";
            roomIcon = "📍";
    }

    const deviceTypeIcon = device.type === "digitalDevice" ? "⚡" : "📊";

    return (
        <View>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    onLongPress={() => setExpanded(true)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    delayLongPress={400}
                    activeOpacity={0.3}
                >
                    <LinearGradient
                        colors={['#412180', '#2B275D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={deviceCardStyle.card}
                    >
                        {/* Status Badge */}
                        <View style={deviceCardStyle.statusBadge}>
                            <View
                                style={[
                                    deviceCardStyle.statusDot,
                                    { backgroundColor: device.status ? "#4ADE80" : "#F87171" },
                                ]}
                            />
                            <Text style={deviceCardStyle.statusText}>
                                {device.status ? t("deviceCard.status.online") : t("deviceCard.status.offline")}
                            </Text>
                        </View>

                        {/* Device Name */}
                        <Text style={deviceCardStyle.deviceNameNew}>{device.name}</Text>

                        {/* Device Info Row */}
                        <View style={deviceCardStyle.infoRow}>
                            <View style={deviceCardStyle.infoItem}>
                                <Text style={deviceCardStyle.infoIcon}>{deviceTypeIcon}</Text>
                                <Text style={deviceCardStyle.infoText}>
                                    {t(`deviceCard.type.${device.type}`)}
                                </Text>
                            </View>
                            <View style={deviceCardStyle.infoDivider} />
                            <View style={deviceCardStyle.infoItem}>
                                <Text style={deviceCardStyle.infoIcon}>{roomIcon}</Text>
                                <Text style={deviceCardStyle.infoText}>{roomName}</Text>
                            </View>
                        </View>

                        {/* Running Time */}
                        <View style={deviceCardStyle.runningTimeContainer}>
                            <Text style={deviceCardStyle.runningTimeLabel}>
                                {t("deviceCard.runningTime")}
                            </Text>
                            <Text style={deviceCardStyle.runningTimeValue}>
                                {(device.RunningTime / 3600).toFixed(1)}h
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <Modal visible={expanded} transparent animationType="fade">
                <Pressable style={deviceCardStyle.overlay} onPress={handleClose}>
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <LinearGradient
                            colors={[GRADIENT[0], GRADIENT[1], GRADIENT[2]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={deviceCardStyle.expandedCard}
                        >
                            {/* Header */}
                            <View style={deviceCardStyle.modalHeader}>
                                <Text style={deviceCardStyle.modalTitle}>{device.name}</Text>
                                <TouchableOpacity
                                    onPress={handleClose}
                                    style={deviceCardStyle.closeButton}
                                >
                                    <Text style={deviceCardStyle.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Status Badge Large */}
                            <View style={deviceCardStyle.statusBadgeLarge}>
                                <View
                                    style={[
                                        deviceCardStyle.statusDotLarge,
                                        { backgroundColor: device.status ? "#4ADE80" : "#F87171" },
                                    ]}
                                />
                                <Text style={deviceCardStyle.statusTextLarge}>
                                    {device.status
                                        ? t("deviceCard.status.online")
                                        : t("deviceCard.status.offline")}
                                </Text>
                            </View>

                            {/* Device Details */}
                            <View style={deviceCardStyle.detailsContainer}>
                                <View style={deviceCardStyle.detailRow}>
                                    <Text style={deviceCardStyle.detailLabel}>
                                        {t("deviceCard.port")}:
                                    </Text>
                                    <Text style={deviceCardStyle.detailValue}>{device.port}</Text>
                                </View>

                                <View style={deviceCardStyle.detailRow}>
                                    <Text style={deviceCardStyle.detailLabel}>
                                        {t(`deviceCard.type.type`)}:
                                    </Text>
                                    <Text style={deviceCardStyle.detailValue}>
                                        {t(`deviceCard.type.${device.type}`)}
                                    </Text>
                                </View>

                                <View style={deviceCardStyle.detailRow}>
                                    <Text style={deviceCardStyle.detailLabel}>
                                        {t("deviceCard.room")}:
                                    </Text>
                                    <Text style={deviceCardStyle.detailValue}>
                                        {roomName}
                                    </Text>
                                </View>

                                <View style={deviceCardStyle.detailRow}>
                                    <Text style={deviceCardStyle.detailLabel}>
                                        {t("deviceCard.runningTime")}:
                                    </Text>
                                    <Text style={deviceCardStyle.detailValue}>
                                        {(device.RunningTime / 3600).toFixed(1)}h
                                    </Text>
                                </View>

                                <View style={deviceCardStyle.detailRow}>
                                    <Text style={deviceCardStyle.detailLabel}>
                                        {t("deviceCard.lastUpdated")}:
                                    </Text>
                                    <Text style={deviceCardStyle.detailValue}>
                                        {device.UpdatedAt
                                            ? new Date(device.UpdatedAt).toLocaleDateString()
                                            : "N/A"}
                                    </Text>
                                </View>
                            </View>

                            {/* Last Data Section */}
                            <View style={deviceCardStyle.dataSection}>
                                <Text style={deviceCardStyle.dataSectionTitle}>
                                    {t("deviceCard.lastData")}
                                </Text>
                                <View style={deviceCardStyle.dataGrid}>
                                    {Object.entries(device.Data).map(([key, value]) => (
                                        <View key={key} style={deviceCardStyle.dataCard}>
                                            <Text style={deviceCardStyle.dataKey}>{key}</Text>
                                            <Text style={deviceCardStyle.dataValue}>
                                                {value.toString()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Action Buttons - Sửa và Xóa */}
                            <View style={deviceCardStyle.actionButtonsContainer}>
                                <TouchableOpacity
                                    style={[deviceCardStyle.actionButton, deviceCardStyle.editButton]}
                                    onPress={handleEdit}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[deviceCardStyle.actionButtonIcon, deviceCardStyle.editButtonIcon]}>
                                        ✏️
                                    </Text>
                                    <Text style={[deviceCardStyle.actionButtonText, deviceCardStyle.editButtonText]}>
                                        {t("deviceCard.edit") || "Sửa thiết bị"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[deviceCardStyle.actionButton, deviceCardStyle.deleteButton]}
                                    onPress={handleDelete}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[deviceCardStyle.actionButtonIcon, deviceCardStyle.deleteButtonIcon]}>
                                        🗑️
                                    </Text>
                                    <Text style={[deviceCardStyle.actionButtonText, deviceCardStyle.deleteButtonText]}>
                                        {t("deviceCard.delete") || "Xóa thiết bị"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </Pressable>
                </Pressable>
            </Modal>

            
        </View>
    );
};
