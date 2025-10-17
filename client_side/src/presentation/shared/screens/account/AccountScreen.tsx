import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Linking, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextWidget } from '@components/TextWidget';
import { ICONS, IMAGES } from '@constants/images';
import { ROUTES } from '@constants/routes';
import { APP_CONFIG } from '@shared/config/appConfig';
import { useAuthContext } from '@src/presentation/hooks/useAppContext';
import { FlexButton } from '../../components/FlexButton';
import { accountScreenStyle } from './accountScreenStyle';

const GRADIENT = ['#412180', '#2B275D', '#030912'] as string[];

interface AccountScreenProps { }

export const AccountScreen: React.FC<AccountScreenProps> = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { authData, logout } = useAuthContext();

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

    const devicePinText = authData?.mid ? `Mã thiết bị: ${authData.mid}` : t('account.noDevice');

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
                        <Image source={IMAGES.LOGO_ROUNDED} style={accountScreenStyle.image} />
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

                        <View style={accountScreenStyle.divider} />

                        <TextWidget
                            text={APP_CONFIG.GITHUB_REPO_URL}
                            icon={ICONS.LINK_ICON}
                            style={{ marginTop: 16, marginBottom: 12 }}
                            onPress={() => handleOpenLink(APP_CONFIG.GITHUB_REPO_URL)}
                        />
                        <TextWidget
                            text={APP_CONFIG.REPORT_DOCUMENTATION_URL}
                            icon={ICONS.FILE_ICON}
                            style={{ marginBottom: 16 }}
                            onPress={() => handleOpenLink(APP_CONFIG.REPORT_DOCUMENTATION_URL)}
                        />

                        <View style={accountScreenStyle.divider} />

                        <View style={accountScreenStyle.firmwareContainer}>
                            <TextWidget
                                text="Phiên bản: 1.0.0"
                                icon={ICONS.DEVICE}
                                style={{ flex: 1, marginTop: 16 }}
                            />
                            <FlexButton
                                title={t('account.updateFirmware')}
                                style={accountScreenStyle.firmwareButton}
                                onPress={handleUpdateFirmware}
                            />
                        </View>

                        <TextWidget
                            text={devicePinText}
                            icon={ICONS.PIN}
                            style={{ marginTop: 16, marginBottom: 24 }}
                        />

                        <FlexButton
                            title={t('account.logout')}
                            style={accountScreenStyle.logoutButton}
                            onPress={handleLogout}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};
