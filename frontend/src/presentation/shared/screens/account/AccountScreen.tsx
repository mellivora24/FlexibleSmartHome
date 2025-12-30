import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextWidget } from '@components/TextWidget';
import { ICONS, IMAGES } from '@constants/images';
import { ROUTES } from '@constants/routes';
import { useAuthContext } from '@src/presentation/hooks/useAppContext';
import { useAuthViewModel } from '@src/presentation/hooks/useAuthViewModel';
import { FlexButton } from '../../components/FlexButton';
import { accountScreenStyle } from './accountScreenStyle';
import { MCURepositoryImpl } from '@domain/repo/mcuRepo';
import { CreateMCU } from '@domain/usecase/mcu/createMCU';
import { UpdateMCU } from '@domain/usecase/mcu/updateMCU';

const GRADIENT = ['#412180', '#2B275D', '#030912'] as string[];

interface AccountScreenProps { }

export const AccountScreen: React.FC<AccountScreenProps> = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { authData, logout, updateUserInfo } = useAuthContext();
    const { updateUser } = useAuthViewModel();

    // MCU Modal states
    const [showMCUModal, setShowMCUModal] = useState(false);
    const [mcuCode, setMcuCode] = useState('');
    const [isUpdatingMCU, setIsUpdatingMCU] = useState(false);

    // Profile Modal states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const handleUpdateFirmware = () => {
        console.log('Update firmware button pressed');
    };

    const handleOpenLink = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Lỗi', 'Không thể mở liên kết này');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi mở liên kết');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            t('account.confirmLogoutTitle'),
            t('account.confirmLogoutMessage'),
            [
                { text: t('account.cancel'), style: 'cancel' },
                { text: t('account.confirm'), style: 'destructive', onPress: processLogout },
            ],
            { cancelable: true }
        );
    };

    const processLogout = () => {
        logout();
        router.replace(ROUTES.AUTH.LOGIN);
    };

    // ========== MCU Update Functions ==========
    const handleOpenMCUModal = () => {
        setMcuCode('');
        setShowMCUModal(true);
    };

    const handleCloseMCUModal = () => {
        setShowMCUModal(false);
        setMcuCode('');
    };

    const handleUpdateMCUCode = async () => {
        if (!mcuCode.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã thiết bị');
            return;
        }

        const IntMcuCode = parseInt(mcuCode, 10);
        if (isNaN(IntMcuCode)) {
            Alert.alert('Lỗi', 'Mã thiết bị phải là số');
            return;
        }

        setIsUpdatingMCU(true);
        try {
            const mcuRepo = new MCURepositoryImpl();

            // Luôn thử UPDATE trước, nếu fail thì CREATE
            try {
                const updateMCUUseCase = new UpdateMCU(mcuRepo);
                await updateMCUUseCase.execute(
                    {
                        current_mcu_code: authData?.mid || 999999,
                        mcu_code: IntMcuCode,
                    },
                    authData?.token || ''
                );
            } catch (updateError: any) {
                // Nếu MCU chưa tồn tại trong Core Service, tạo mới
                if (updateError.message?.includes('not found') || updateError.message?.includes('404')) {
                    const createMCUUseCase = new CreateMCU(mcuRepo);
                    await createMCUUseCase.execute(
                        {
                            mcu_code: IntMcuCode,
                            firmware_version: "1.0.0",
                        },
                        authData?.token || ''
                    );
                } else {
                    throw updateError;
                }
            }

            // Cập nhật MCU code trên Auth Service
            if (authData?.id && updateUser) {
                const updateResult = await updateUser(
                    {
                        id: authData.id,
                        mcu_code: IntMcuCode,
                    },
                    authData.token
                );

                if (updateResult) {
                    // Cập nhật vào context
                    await updateUserInfo({ mid: updateResult.mid });
                    Alert.alert('Thành công', 'Đã cập nhật mã thiết bị thành công');
                    handleCloseMCUModal();
                }
            }
        } catch (error: any) {
            console.error('MCU update failed:', error);
            Alert.alert('Lỗi', error.message || 'Không thể cập nhật mã thiết bị');
        } finally {
            setIsUpdatingMCU(false);
        }
    };

    // ========== Profile Update Functions ==========
    const handleOpenProfileModal = () => {
        setProfileName(authData?.name || '');
        setProfileEmail(authData?.email || '');
        setShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
        setProfileName('');
        setProfileEmail('');
    };

    const handleUpdateProfile = async () => {
        if (!profileName.trim() && !profileEmail.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên hoặc email');
            return;
        }

        setIsUpdatingProfile(true);
        try {
            if (authData?.id && updateUser) {
                const updates: any = { id: authData.id };
                
                if (profileName.trim() !== authData.name) {
                    updates.name = profileName.trim();
                }
                
                if (profileEmail.trim() !== authData.email) {
                    updates.email = profileEmail.trim();
                }

                const updateResult = await updateUser(updates, authData.token);

                if (updateResult) {
                    // Cập nhật vào context
                    const contextUpdates: any = {};
                    if (updateResult.name) contextUpdates.name = updateResult.name;
                    if (updateResult.email) contextUpdates.email = updateResult.email;
                    
                    await updateUserInfo(contextUpdates);
                    Alert.alert('Thành công', 'Đã cập nhật thông tin thành công');
                    handleCloseProfileModal();
                }
            }
        } catch (error: any) {
            console.error('Profile update failed:', error);
            Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const devicePinText = authData?.mid ? `Mã thiết bị: ${authData.mid}` : 'Chưa có thiết bị';

    return (
        <LinearGradient
            colors={GRADIENT as [string, string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={accountScreenStyle.container}>
                <ScrollView
                    contentContainerStyle={accountScreenStyle.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={accountScreenStyle.logoContainer}>
                        <Image source={IMAGES.AVATAR_PLACEHOLDER} style={accountScreenStyle.image} />
                    </View>

                    <View style={accountScreenStyle.glassCard}>
                        <TextWidget
                            text={authData?.name || 'Guest User'}
                            icon={ICONS.NAME}
                            style={{ marginBottom: 16 }}
                        />
                        <TextWidget
                            text={authData?.email || 'No Email'}
                            icon={ICONS.EMAIL}
                            style={{ marginBottom: 16 }}
                        />

                        <FlexButton
                            title="Cập nhật thông tin"
                            style={accountScreenStyle.updateProfileButton}
                            onPress={handleOpenProfileModal}
                        />

                        <View style={accountScreenStyle.divider} />

                        {/* MCU Code Section */}
                        <View style={{ marginTop: 16, marginBottom: 16 }}>
                            <TextWidget
                                text={devicePinText}
                                icon={ICONS.DEVICE}
                                style={{ marginBottom: 12 }}
                            />
                            <FlexButton
                                title={authData?.mid ? "Cập nhật mã thiết bị" : "Thêm thiết bị"}
                                style={accountScreenStyle.updateMCUButton}
                                onPress={handleOpenMCUModal}
                            />
                        </View>

                        <View style={accountScreenStyle.divider} />

                        <FlexButton
                            title={t('account.logout')}
                            style={accountScreenStyle.logoutButton}
                            onPress={handleLogout}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* MCU Update Modal */}
            <Modal
                visible={showMCUModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseMCUModal}
            >
                <TouchableOpacity
                    style={accountScreenStyle.modalOverlay}
                    activeOpacity={1}
                    onPress={handleCloseMCUModal}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={accountScreenStyle.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={accountScreenStyle.modalTitle}>
                            {authData?.mid ? "Cập nhật mã thiết bị" : "Thêm thiết bị mới"}
                        </Text>
                        <Text style={accountScreenStyle.modalSubtitle}>
                            Nhập mã thiết bị MCU của bạn
                        </Text>

                        <View style={accountScreenStyle.inputContainer}>
                            <Image source={ICONS.DEVICE} style={accountScreenStyle.inputIcon} />
                            <TextInput
                                style={accountScreenStyle.input}
                                placeholder="Nhập mã thiết bị"
                                placeholderTextColor="#999"
                                value={mcuCode}
                                onChangeText={setMcuCode}
                                keyboardType="numeric"
                                editable={!isUpdatingMCU}
                            />
                        </View>

                        <View style={accountScreenStyle.modalButtons}>
                            <TouchableOpacity
                                style={[accountScreenStyle.modalButton, accountScreenStyle.cancelButton]}
                                onPress={handleCloseMCUModal}
                                disabled={isUpdatingMCU}
                            >
                                <Text style={accountScreenStyle.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    accountScreenStyle.modalButton,
                                    accountScreenStyle.confirmButton,
                                    isUpdatingMCU && accountScreenStyle.disabledButton
                                ]}
                                onPress={handleUpdateMCUCode}
                                disabled={isUpdatingMCU}
                            >
                                <Text style={accountScreenStyle.confirmButtonText}>
                                    {isUpdatingMCU ? 'Đang xử lý...' : 'Xác nhận'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Profile Update Modal */}
            <Modal
                visible={showProfileModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseProfileModal}
            >
                <TouchableOpacity
                    style={accountScreenStyle.modalOverlay}
                    activeOpacity={1}
                    onPress={handleCloseProfileModal}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={accountScreenStyle.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={accountScreenStyle.modalTitle}>
                            Cập nhật thông tin
                        </Text>
                        <Text style={accountScreenStyle.modalSubtitle}>
                            Chỉnh sửa tên và email của bạn
                        </Text>

                        <View style={accountScreenStyle.inputContainer}>
                            <Image source={ICONS.NAME} style={accountScreenStyle.inputIcon} />
                            <TextInput
                                style={accountScreenStyle.input}
                                placeholder="Tên"
                                placeholderTextColor="#999"
                                value={profileName}
                                onChangeText={setProfileName}
                                editable={!isUpdatingProfile}
                            />
                        </View>

                        <View style={accountScreenStyle.inputContainer}>
                            <Image source={ICONS.EMAIL} style={accountScreenStyle.inputIcon} />
                            <TextInput
                                style={accountScreenStyle.input}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={profileEmail}
                                onChangeText={setProfileEmail}
                                keyboardType="email-address"
                                editable={!isUpdatingProfile}
                            />
                        </View>

                        <View style={accountScreenStyle.modalButtons}>
                            <TouchableOpacity
                                style={[accountScreenStyle.modalButton, accountScreenStyle.cancelButton]}
                                onPress={handleCloseProfileModal}
                                disabled={isUpdatingProfile}
                            >
                                <Text style={accountScreenStyle.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    accountScreenStyle.modalButton,
                                    accountScreenStyle.confirmButton,
                                    isUpdatingProfile && accountScreenStyle.disabledButton
                                ]}
                                onPress={handleUpdateProfile}
                                disabled={isUpdatingProfile}
                            >
                                <Text style={accountScreenStyle.confirmButtonText}>
                                    {isUpdatingProfile ? 'Đang xử lý...' : 'Xác nhận'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </LinearGradient>
    );
};
