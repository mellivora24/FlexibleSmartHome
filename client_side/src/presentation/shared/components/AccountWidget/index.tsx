import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';

import { IMAGES } from '@constants/images';
import '@i18n';
import { accountWidgetStyle } from './accountWidgetStyle';

interface AccountWidgetProps {
    username?: string;
    avatarUrl?: string;
}

export const AccountWidget: React.FC<AccountWidgetProps> = ({username, avatarUrl}) => {
    const { t } = useTranslation();
    const timeNow = new Date().getHours();

    const iconPath = avatarUrl ? { uri: avatarUrl } : IMAGES.AVATAR_PLACEHOLDER;
    const greeting = 
        (4 < timeNow && timeNow <= 12) ? t('accountWidget.greeting.morning')
        : (12 < timeNow && timeNow <= 18) ? t('accountWidget.greeting.afternoon')
        : t('accountWidget.greeting.evening');

    return (
        <View style={accountWidgetStyle.container}>
            <Image
                source={iconPath}
                style={accountWidgetStyle.avatar}
            />
            <View style={accountWidgetStyle.textView}>
                <Text style={accountWidgetStyle.greeting}>{greeting}</Text>
                {username ? (
                    <Text style={accountWidgetStyle.username}>{username}</Text>
                ) : null}
            </View>
        </View>
    );
};
