import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { DEVICE_TYPES, DEVICE_TYPE_LIST } from "@constants/deviceType";
import { ROOM_LIST } from "@constants/rooms";
import { CreateDeviceRequest } from '@src/domain/model/Device';
import { portToLabel } from '@src/domain/utils/portUtils';
import { useAuthContext } from '@src/presentation/hooks/useAppContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { addModalStyle } from "./addModalStyle";

const GRADIENT = ["#412180", "#2B275D", "#030912"];

interface AddModalProps {
    visible: boolean;
    availablePorts?: number[];
    loadingPorts?: boolean;
    onClose: () => void;
    onSave?: (device: CreateDeviceRequest) => Promise<void>;
}

export const AddModalComponent: React.FC<AddModalProps> = ({
    visible,
    availablePorts = [],
    loadingPorts = false,
    onSave,
    onClose
}) => {
    const { t } = useTranslation();
    const { authData } = useAuthContext();

    const [nameState, setNameState] = useState("");
    const [portState, setPortState] = useState<number | null>(null);
    const [ridState, setRidState] = useState<number | null>(null);
    const [typeState, setTypeState] = useState<string | null>(DEVICE_TYPES.DIGITAL_DEVICE);

    const [portOpen, setPortOpen] = useState(false);
    const [roomOpen, setRoomOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const uniquePorts = Array.from(new Set(
        availablePorts
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
            setNameState("");
            setPortState(null);
            setRidState(null);
            setTypeState(DEVICE_TYPES.DIGITAL_DEVICE);
            setPortOpen(false);
            setRoomOpen(false);
            setTypeOpen(false);
        }
    }, [visible]);

    const handleClose = () => {
        setPortOpen(false);
        setRoomOpen(false);
        setTypeOpen(false);
        onClose();
    };

    const handleSave = async () => {
        if (!nameState.trim()) {
            alert(t("deviceCard.validation.nameRequired") || "Vui lòng nhập tên thiết bị");
            return;
        }

        if (portState === null) {
            alert(t("deviceCard.validation.portRequired") || "Vui lòng chọn cổng");
            return;
        }

        if (ridState === null) {
            alert(t("deviceCard.validation.roomRequired") || "Vui lòng chọn phòng");
            return;
        }

        if (!typeState) {
            alert(t("deviceCard.validation.typeRequired") || "Vui lòng chọn loại thiết bị");
            return;
        }

        try {
            if (typeState === DEVICE_TYPES.DHT11_SENSOR) {
                const tempDevice: CreateDeviceRequest = {
                    mid: authData?.mid || 0,
                    rid: ridState,
                    name: `${nameState.trim()} - Nhiệt độ`,
                    type: DEVICE_TYPES.TEMPERATURE_SENSOR,
                    port: portState,
                };

                const humDevice: CreateDeviceRequest = {
                    mid: authData?.mid || 0,
                    rid: ridState,
                    name: `${nameState.trim()} - Độ ẩm`,
                    type: DEVICE_TYPES.HUMIDITY_SENSOR,
                    port: portState,
                };

                if (onSave) {
                    console.log('[AddModal] Creating temperature device:', tempDevice);
                    await onSave(tempDevice);
                    console.log('[AddModal] Temperature device created successfully');
                    
                    console.log('[AddModal] Creating humidity device:', humDevice);
                    await onSave(humDevice);
                    console.log('[AddModal] Humidity device created successfully');
                    console.log('[AddModal] DHT11 sensor setup complete - both devices created');
                }
            } else {
                const newDevice: CreateDeviceRequest = {
                    mid: authData?.mid || 0,
                    rid: ridState,
                    name: nameState.trim(),
                    type: typeState,
                    port: portState,
                };

                if (onSave) {
                    await onSave(newDevice);
                }
            }
            
            setPortOpen(false);
            setRoomOpen(false);
            setTypeOpen(false);
            
            handleClose();
        } catch (error) {
            console.error('[AddModal] Error creating device:', error);
        }
    };

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
            <Pressable style={addModalStyle.overlay} onPress={handleClose}>
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <LinearGradient
                        colors={[GRADIENT[0], GRADIENT[1], GRADIENT[2]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={addModalStyle.expandedCard}
                    >
                        {/* Header */}
                        <View style={addModalStyle.modalHeader}>
                            <Text style={addModalStyle.modalTitle}>
                                {t("deviceCard.addDevice") || "Thêm thiết bị mới"}
                            </Text>
                            <TouchableOpacity
                                onPress={handleClose}
                                style={addModalStyle.closeButton}
                            >
                                <Text style={addModalStyle.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Container */}
                        <View style={{ zIndex: 3000 }}>
                            <View style={addModalStyle.formContainer}>
                                {/* Device Name Input */}
                                <View style={addModalStyle.formRow}>
                                    <Text style={addModalStyle.formLabel}>
                                        {t("deviceCard.name")}:
                                    </Text>
                                    <TextInput
                                        style={[addModalStyle.textInput, { minWidth: 150 }]}
                                        value={nameState}
                                        onChangeText={setNameState}
                                        placeholder={t("deviceCard.namePlaceholder") || "Nhập tên thiết bị"}
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                    />
                                </View>

                                {/* Port Dropdown */}
                                <View style={[addModalStyle.formRow, { zIndex: 3000 }]}>
                                    <Text style={addModalStyle.formLabel}>
                                        {t("deviceCard.port")}:
                                    </Text>
                                    {loadingPorts ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <ActivityIndicator size="small" color="#fff" />
                                            <Text style={{ color: '#fff', marginLeft: 8 }}>
                                                Đang tải...
                                            </Text>
                                        </View>
                                    ) : portItems.length > 0 ? (
                                        <View style={addModalStyle.dropdownContainer}>
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
                                                style={addModalStyle.dropdownStyle}
                                                textStyle={addModalStyle.dropdownTextStyle}
                                                dropDownContainerStyle={addModalStyle.dropdownListContainer}
                                                listItemLabelStyle={addModalStyle.dropdownListItemLabel}
                                                selectedItemLabelStyle={addModalStyle.dropdownSelectedItemLabel}
                                                zIndex={3000}
                                                zIndexInverse={1000}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={addModalStyle.errorText}>
                                            {t("deviceCard.noPortAvailable") || "Không có cổng khả dụng"}
                                        </Text>
                                    )}
                                </View>

                                {/* Room Dropdown */}
                                <View style={[addModalStyle.formRow, { zIndex: 2000 }]}>
                                    <Text style={addModalStyle.formLabel}>
                                        {t("deviceCard.room")}:
                                    </Text>
                                    {roomItems.length > 0 ? (
                                        <View style={addModalStyle.dropdownContainer}>
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
                                                placeholder={t("deviceCard.selectRoom") || "Chọn phòng"}
                                                style={addModalStyle.dropdownStyle}
                                                textStyle={addModalStyle.dropdownTextStyle}
                                                dropDownContainerStyle={addModalStyle.dropdownListContainer}
                                                listItemLabelStyle={addModalStyle.dropdownListItemLabel}
                                                selectedItemLabelStyle={addModalStyle.dropdownSelectedItemLabel}
                                                zIndex={2000}
                                                zIndexInverse={2000}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={addModalStyle.errorText}>
                                            {t("deviceCard.noRoomAvailable") || "Không có phòng"}
                                        </Text>
                                    )}
                                </View>

                                {/* Type Dropdown */}
                                <View style={[addModalStyle.formRow, { zIndex: 1000 }]}>
                                    <Text style={addModalStyle.formLabel}>
                                        {t(`deviceCard.type.type`)}:
                                    </Text>
                                    {typeItems.length > 0 ? (
                                        <View style={addModalStyle.dropdownContainer}>
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
                                                style={addModalStyle.dropdownStyle}
                                                textStyle={addModalStyle.dropdownTextStyle}
                                                dropDownContainerStyle={addModalStyle.dropdownListContainer}
                                                listItemLabelStyle={addModalStyle.dropdownListItemLabel}
                                                selectedItemLabelStyle={addModalStyle.dropdownSelectedItemLabel}
                                                zIndex={1000}
                                                zIndexInverse={3000}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={addModalStyle.errorText}>
                                            {t("deviceCard.noTypeAvailable") || "Không có loại"}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            {/* Spacer to prevent overlap */}
                            <View style={addModalStyle.spacer}></View>

                            {/* Save Button */}
                            <TouchableOpacity
                                style={addModalStyle.saveButton}
                                onPress={handleSave}
                                disabled={loadingPorts}
                            >
                                <Text style={addModalStyle.saveButtonText}>
                                    {t("deviceCard.addDevice") || "Thêm thiết bị"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
