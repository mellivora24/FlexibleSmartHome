import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { ICONS } from "@constants/images";
import { AccountWidget } from "../AccountWidget";
import { topBarWidgetStyle } from "./topBarWidget";

interface TopBarWidgetProps {
    username: string;
    avatarUrl?: string;
    isHavingNotification: boolean;
    onAvatarPress?: () => void;
    onNotificationPress?: () => void;
}

export const TopBarWidget: React.FC<TopBarWidgetProps> = ({
    username,
    avatarUrl,
    isHavingNotification = false,
    onAvatarPress,
    onNotificationPress,
}) => {
    const notificationIcon = isHavingNotification ? ICONS.NOTIFICATION_1 : ICONS.NOTIFICATION_0;

    return (
        <View style={topBarWidgetStyle.container}>
            <AccountWidget
                username={username}
                avatarUrl={avatarUrl}
                onAvatarPress={onAvatarPress}
            />
            <TouchableOpacity onPress={onNotificationPress}>
                <Image
                    source={notificationIcon}
                    style={topBarWidgetStyle.notificationIcon}
                />
            </TouchableOpacity>
        </View>
    );
};
