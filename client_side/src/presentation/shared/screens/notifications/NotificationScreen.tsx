import React from 'react';
import { Text, View } from 'react-native';

import { notificationScreenStyle } from '../../screens/notifications/notificationScreenStyle';

interface NotificationProps {}

export const NotificationScreen: React.FC<NotificationProps> = () => {
    return (
        <View style={notificationScreenStyle.container}>
            <Text style={notificationScreenStyle.title}>This is a notification component.</Text>
        </View>
    );
};
