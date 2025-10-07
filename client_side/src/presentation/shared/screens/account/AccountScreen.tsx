import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, View } from 'react-native';

import { TextWidget } from '@components/TextWidget';
import { ICONS, IMAGES } from '@constants/images';
import { ROUTES } from '@constants/routes';
import { APP_CONFIG } from '@shared/config/appConfig';
import { useAuthContext } from '@src/presentation/shared/hooks/useAuth';
import { BACKGROUND } from '@theme/colors';
import { FlexButton } from '../../components/FlexButton';
import { accountScreenStyle } from './accountScreenStyle';

interface AccountScreenProps {}

export const AccountScreen: React.FC<AccountScreenProps> = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const { authData, logout } = useAuthContext();

    const handleUpdateFirmware = () => {
        // TODO: Implement firmware update logic
        console.log('Update firmware button pressed');
    };

    const handleOpenLink = (url: string) => {
        // TODO: Implement open link logic
        console.log(`Open link: ${url}`);
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

    const devicePinText = authData?.mid ? `Mã thiết bị của bạn: ${authData.mid}` : t('account.noDevice');

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={accountScreenStyle.container}
        >
            <Image source={IMAGES.LOGO_ROUNDED} style={accountScreenStyle.image} />
            <View style={accountScreenStyle.infoContainer}>
                <TextWidget text={authData?.name || 'Guest User'} icon={ICONS.NAME} style={{ marginBottom: 10 }} />
                <TextWidget text={authData?.email || 'No Email'} icon={ICONS.EMAIL} />
                <TextWidget
                    text={APP_CONFIG.GITHUB_REPO_URL}
                    icon={ICONS.LINK_ICON}
                    style={{ marginTop: 10 }}
                    onPress={() => { handleOpenLink(APP_CONFIG.GITHUB_REPO_URL); }}
                />
                <TextWidget
                    text={APP_CONFIG.REPORT_DOCUMENTATION_URL}
                    icon={ICONS.FILE_ICON}
                    style={{ marginTop: 10 }}
                    onPress={() => { handleOpenLink(APP_CONFIG.REPORT_DOCUMENTATION_URL); }}
                />

                {/* TODO: replace firmware version with actual data from API  */}
                <View style={accountScreenStyle.firmwareContainer}>
                    <TextWidget text="Phiên bản: 1.0.0" icon={ICONS.DEVICE} style={{ marginTop: 10, maxWidth: 213 }} />
                    <FlexButton
                        title={t('account.updateFirmware')}
                        style={{ maxWidth: 180, marginLeft: 8, borderRadius: 8, paddingVertical: 11, paddingHorizontal: 16, marginTop: 10 }}
                        onPress={handleUpdateFirmware}
                    />
                </View>

                <TextWidget text={devicePinText} icon={ICONS.PIN} style={{ marginTop: 10 }} />

                <FlexButton
                    title={t('account.logout')}
                    style={{ marginTop: 30, paddingVertical: 12, paddingHorizontal: 48 }}
                    onPress={handleLogout}
                />

            </View>
        </LinearGradient>
    );
};
