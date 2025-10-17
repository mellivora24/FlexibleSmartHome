import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { ICONS } from "@constants/images";
import { useNotificationContext } from "@hooks/NotificationContext";
import { useAuthContext } from "@hooks/useAppContext";
import { AccountWidget } from "../AccountWidget";
import { topBarWidgetStyle } from "./topBarWidget";

interface TopBarWidgetProps {
    onAvatarPress?: () => void;
    onNotificationPress?: () => void;
}

export const TopBarWidget: React.FC<TopBarWidgetProps> = ({
    onAvatarPress,
    onNotificationPress,
}) => {
    const { authData } = useAuthContext();
    const { unreadCount } = useNotificationContext();
    const notificationIcon = ICONS.NOTIFICATION_0;

    return (
        <View style={topBarWidgetStyle.container}>
            <AccountWidget
                username={authData?.name || "User"}
                onAvatarPress={onAvatarPress}
            />
            <View style={topBarWidgetStyle.notificationContainer}>
                <TouchableOpacity onPress={onNotificationPress}>
                    {unreadCount > 0 && (
                        <Text style={topBarWidgetStyle.notificationCount}>{unreadCount}</Text>
                    )}
                    <Image
                        source={notificationIcon}
                        style={topBarWidgetStyle.notificationIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
