import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import {
    Animated,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useDeviceCard } from '@hooks/useDeviceCard';
import { Device, UpdateDeviceRequest } from "@src/domain/model/Device";
import { ModalComponent } from '../editModal/Modal';
import { deviceCardStyle } from "./deviceCardStyle";

interface DeviceCardProps {
    device: Device;
    onDelete?: (deviceId: number) => void;
    onEdit?: (deviceUpdate: UpdateDeviceRequest) => void;
}

const availablePorts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onEdit, onDelete }) => {
    const {
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
    } = useDeviceCard(device, onEdit, onDelete);

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

            <ModalComponent
                visible={expanded}
                id={device.id}
                rid={device.rid}
                name={device.name}
                port={device.port}
                type={device.type}
                Data={device.Data}
                RoomName={roomName}
                status={device.status}
                UpdatedAt={device.UpdatedAt}
                RunningTime={device.RunningTime}
                availablePorts={availablePorts}
                onSaveEdit={handleEdit}
                onClose={handleClose}
                onDelete={handleDelete}
            />

        </View>
    );
};
