import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { IMAGES } from '@constants/images';
import { useAuthContext } from '@src/presentation/hooks/useAuth';
import { accountWidgetStyle } from './accountWidgetStyle';

interface AccountWidgetProps {
    username?: string;
    avatarUrl?: string;
    onAvatarPress?: () => void;
}

export const AccountWidget: React.FC<AccountWidgetProps> = ({username, avatarUrl, onAvatarPress}) => {
    const { t } = useTranslation();
    const timeNow = new Date().getHours();

    const { authData } = useAuthContext();

    const iconPath = avatarUrl ? { uri: avatarUrl } : IMAGES.AVATAR_PLACEHOLDER;
    const greeting = 
        (4 < timeNow && timeNow <= 12) ? t('accountWidget.greeting.morning')
        : (12 < timeNow && timeNow <= 18) ? t('accountWidget.greeting.afternoon')
        : t('accountWidget.greeting.evening');

    return (
        <View style={accountWidgetStyle.container}>
            <TouchableOpacity onPress={onAvatarPress}>
                <Image
                    source={iconPath}
                    style={accountWidgetStyle.avatar}
                />
            </TouchableOpacity>
            <View style={accountWidgetStyle.textView}>
                <Text style={accountWidgetStyle.greeting}>{greeting}</Text>
                <Text style={accountWidgetStyle.username}>{authData?.name || 'Guest User'}</Text>
            </View>
        </View>
    );
};
