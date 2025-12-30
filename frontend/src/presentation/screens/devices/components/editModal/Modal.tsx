import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { DEVICE_TYPES, DEVICE_TYPE_LIST } from "@constants/deviceType";
import { ROOM_LIST } from "@constants/rooms";
import { UpdateDeviceRequest } from '@src/domain/model/Device';
import { portToLabel } from '@src/domain/utils/portUtils';
import { useAuthContext } from '@src/presentation/hooks/useAppContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { modalStyle } from "./ModalStyle";

const GRADIENT = ["#412180", "#2B275D", "#030912"];

interface ModalProps {
    id?: number;
    rid?: number;
    name?: string;
    port?: number;
    type?: string;
    visible: boolean;
    status?: boolean;
    RoomName?: string;
    RunningTime?: number;
    UpdatedAt?: Date | null;
    Data?: Record<string, any>;
    availablePorts?: number[];
    onClose: () => void;
    onSaveEdit?: (device: UpdateDeviceRequest) => void;
    onDelete?: () => void;
}

export const ModalComponent: React.FC<ModalProps> = ({
    visible,
    id,
    rid,
    port,
    type,
    name,
    status,
    RoomName,
    UpdatedAt,
    availablePorts,
    onSaveEdit,
    onDelete,
    onClose
}) => {
    const { t } = useTranslation();
    const { authData } = useAuthContext();
    
    const [isEditing, setIsEditing] = useState(false);
    const [nameState, setNameState] = useState(name || "");
    const [portState, setPortState] = useState<number | null>(port || null);
    const [ridState, setRidState] = useState<number | null>(rid || null);
    const [typeState, setTypeState] = useState<string | null>(type || DEVICE_TYPES.DIGITAL_DEVICE);

    const [portOpen, setPortOpen] = useState(false);
    const [roomOpen, setRoomOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const uniquePorts = Array.from(new Set(
        (availablePorts || [])
            .filter((p) => p !== null && p !== undefined && !isNaN(Number(p)))
            .map(p => Number(p))
    ));
    
    const portItems = uniquePorts.map((p) => ({ 
        label: `Cổng ${portToLabel(p)}`, 
        value: p
    }));

    const roomItems = ROOM_LIST.map((room) => ({ 
        label: room.name, 
        value: room.id 
    }));

    const typeItems = DEVICE_TYPE_LIST.map((deviceType) => ({ 
        label: t(`deviceCard.type.${deviceType}`), 
        value: deviceType 
    }));

    useEffect(() => {
        if (!visible) {
            setPortOpen(false);
            setRoomOpen(false);
            setTypeOpen(false);
            setIsEditing(false);
        }

        setNameState(name || "");
        setPortState(port || null);
        setRidState(rid || null);
        setTypeState(type || DEVICE_TYPES.DIGITAL_DEVICE);
    }, [visible, name, port, rid, type]);

    const handleClose = () => {
        setPortOpen(false);
        setRoomOpen(false);
        setTypeOpen(false);
        setIsEditing(false);
        onClose();
    };

    const handleSaveEdit = () => {
        const deviceUpdate: UpdateDeviceRequest = {
            id: id || 0,
            mid: authData?.mid || 0,
            rid: ridState,
            port: portState,
            type: typeState,
            name: nameState,
            status: true
        };

        console.log("Saving device edit:", deviceUpdate);

        onSaveEdit?.(deviceUpdate);
        setIsEditing(false);

        setPortOpen(false);
        setRoomOpen(false);
        setTypeOpen(false);
    };

    const handleDeletePress = () => {
        setPortOpen(false);
        setRoomOpen(false);
        setTypeOpen(false);
        onClose();
        onDelete?.();
    };

    const handleViewPress = () => {
        setIsEditing(false);
        setPortOpen(false);
        setRoomOpen(false);
        setTypeOpen(false);
    }

    const handleEditPress = () => {
        setIsEditing(true);
        setPortOpen(false);
        setRoomOpen(false);
        setTypeOpen(false);
    }

    const onPortOpen = () => {
        setRoomOpen(false);
        setTypeOpen(false);
    };

    const onRoomOpen = () => {
        setPortOpen(false);
        setTypeOpen(false);
    };

    const onTypeOpen = () => {
        setPortOpen(false);
        setRoomOpen(false);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={modalStyle.overlay} onPress={handleClose}>
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <LinearGradient
                        colors={[GRADIENT[0], GRADIENT[1], GRADIENT[2]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={modalStyle.expandedCard}
                    >
                        {/* Header */}
                        <View style={modalStyle.modalHeader}>
                            {isEditing ? (
                                <TextInput
                                    style={modalStyle.modalTitle}
                                    value={nameState}
                                    onChangeText={setNameState}
                                    placeholder={t("deviceCard.namePlaceholder") || "Nhập tên thiết bị"}
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                />
                            ) : (
                                <Text style={modalStyle.modalTitle}>{name}</Text>
                            )}
                            <TouchableOpacity
                                onPress={handleClose}
                                style={modalStyle.closeButton}
                            >
                                <Text style={modalStyle.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Status Badge Large */}
                        {!isEditing && (
                            <View style={modalStyle.statusBadgeLarge}>
                                <View
                                    style={[
                                        modalStyle.statusDotLarge,
                                        { backgroundColor: status ? "#4ADE80" : "#F87171" },
                                    ]}
                                />
                                <Text style={modalStyle.statusTextLarge}>
                                    {status
                                        ? t("deviceCard.status.online")
                                        : t("deviceCard.status.offline")}
                                </Text>
                            </View>
                        )}

                        {/* Details and Data Section */}
                        <View style={{ zIndex: 3000 }}>
                            {/* Device Details */}
                            <View style={modalStyle.detailsContainer}>
                                {/* Port Dropdown */}
                                <View style={[modalStyle.detailRow, { zIndex: 3000 }]}>
                                    <Text style={modalStyle.detailLabel}>
                                        {t("deviceCard.port")}:
                                    </Text>
                                    {isEditing && portItems.length > 0 ? (
                                        <View style={{ flex: 1, marginLeft: 10, minWidth: 100 }}>
                                            <DropDownPicker
                                                items={portItems}
                                                open={portOpen}
                                                value={portState}
                                                setOpen={setPortOpen}
                                                setValue={(callback) => {
                                                    if (typeof callback === 'function') {
                                                        setPortState((prev) => callback(prev));
                                                    } else {
                                                        setPortState(callback);
                                                    }
                                                }}
                                                onOpen={onPortOpen}
                                                onChangeValue={(value) => {
                                                    if (value !== null) {
                                                        setPortState(value);
                                                    }
                                                }}
                                                placeholder={t("deviceCard.selectPort") || "Chọn port"}
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                    minHeight: 40,
                                                }}
                                                textStyle={{ color: '#FFF' }}
                                                dropDownContainerStyle={{
                                                    backgroundColor: '#2B275D',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                }}
                                                listItemLabelStyle={{ color: '#FFF' }}
                                                selectedItemLabelStyle={{ color: '#4ADE80' }}
                                                zIndex={3000}
                                                zIndexInverse={1000}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={modalStyle.detailValue}>{port ? portToLabel(port) : ''}</Text>
                                    )}
                                </View>

                                {/* Room Dropdown */}
                                <View style={[modalStyle.detailRow, { zIndex: 2000 }]}>
                                    <Text style={modalStyle.detailLabel}>
                                        {t("deviceCard.room")}:
                                    </Text>
                                    {isEditing && roomItems.length > 0 ? (
                                        <View style={{ flex: 1, marginLeft: 10, minWidth: 100 }}>
                                            <DropDownPicker
                                                items={roomItems}
                                                open={roomOpen}
                                                value={ridState}
                                                setOpen={setRoomOpen}
                                                setValue={(callback) => {
                                                    if (typeof callback === 'function') {
                                                        setRidState((prev) => callback(prev));
                                                    } else {
                                                        setRidState(callback);
                                                    }
                                                }}
                                                onOpen={onRoomOpen}
                                                onChangeValue={(value) => {
                                                    if (value !== null) {
                                                        setRidState(value);
                                                    }
                                                }}
                                                placeholder={RoomName}
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                    minHeight: 40,
                                                }}
                                                textStyle={{ color: '#FFF' }}
                                                dropDownContainerStyle={{
                                                    backgroundColor: '#2B275D',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                }}
                                                listItemLabelStyle={{ color: '#FFF' }}
                                                selectedItemLabelStyle={{ color: '#4ADE80' }}
                                                zIndex={2000}
                                                zIndexInverse={2000}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={modalStyle.detailValue}>{RoomName}</Text>
                                    )}
                                </View>

                                {/* Type Dropdown */}
                                <View style={[modalStyle.detailRow, { zIndex: 1000 }]}>
                                    <Text style={modalStyle.detailLabel}>
                                        {t(`deviceCard.type.type`)}:
                                    </Text>
                                    {isEditing && typeItems.length > 0 ? (
                                        <View style={{ flex: 1, marginLeft: 10, minWidth: 100 }}>
                                            <DropDownPicker
                                                items={typeItems}
                                                open={typeOpen}
                                                value={typeState}
                                                setOpen={setTypeOpen}
                                                setValue={(callback) => {
                                                    if (typeof callback === 'function') {
                                                        setTypeState((prev) => callback(prev));
                                                    } else {
                                                        setTypeState(callback);
                                                    }
                                                }}
                                                onOpen={onTypeOpen}
                                                onChangeValue={(value) => {
                                                    if (value !== null) {
                                                        setTypeState(value);
                                                    }
                                                }}
                                                placeholder={t("deviceCard.selectType") || "Chọn loại"}
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                    minHeight: 40,
                                                }}
                                                textStyle={{ color: '#FFF' }}
                                                dropDownContainerStyle={{
                                                    backgroundColor: '#2B275D',
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                }}
                                                listItemLabelStyle={{ color: '#FFF' }}
                                                selectedItemLabelStyle={{ color: '#4ADE80' }}
                                                zIndex={1000}
                                                zIndexInverse={3000}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={modalStyle.detailValue}>
                                            {t(`deviceCard.type.${type}`)}
                                        </Text>
                                    )}
                                </View>

                                {/* Updated At */}
                                {!isEditing && (
                                    <View style={modalStyle.detailRow}>
                                        <Text style={modalStyle.detailLabel}>
                                            {t("deviceCard.lastUpdated")}:
                                        </Text>
                                        <Text style={modalStyle.detailValue}>
                                            {UpdatedAt
                                                ? new Date(UpdatedAt).toLocaleDateString()
                                                : "N/A"}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View style={{ minWidth: "93.5%" }}></View>

                            {isEditing && (
                                <>
                                    <TouchableOpacity
                                        style={modalStyle.saveButton}
                                        onPress={handleSaveEdit}
                                    >
                                        <Text style={modalStyle.saveButtonText}>
                                            {t("deviceCard.saveChanges") || "Lưu thay đổi"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[modalStyle.saveButton, modalStyle.deleteButton]}
                                        onPress={handleDeletePress}
                                    >
                                        <Text style={[modalStyle.saveButtonText, modalStyle.deleteButtonText]}>
                                            {t("deviceCard.delete") || "Xóa"}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Tab Buttons - Xem, Sửa */}
                        <View style={modalStyle.actionButtonsContainer}>
                            <TouchableOpacity
                                style={[
                                    modalStyle.actionButton, 
                                    !isEditing ? modalStyle.activeButton : modalStyle.editButton
                                ]}
                                onPress={handleViewPress}
                                activeOpacity={isEditing ? 0.7 : 1}
                            >
                                <Text style={[modalStyle.actionButtonText, modalStyle.editButtonText]}>
                                    {t("deviceCard.view") || "Xem"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    modalStyle.actionButton, 
                                    isEditing ? modalStyle.activeButton : modalStyle.editButton
                                ]}
                                onPress={handleEditPress}
                                activeOpacity={isEditing ? 1 : 0.7}
                            >
                                <Text style={[modalStyle.actionButtonText, modalStyle.editButtonText]}>
                                    {t("deviceCard.edit") || "Sửa"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
