import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { navigationBarStyle } from './navigationBar';

function genarateTabBar(
    state?: BottomTabBarProps['state'],
    descriptors?: BottomTabBarProps['descriptors'],
    navigation?: BottomTabBarProps['navigation']
) {
    return state?.routes.map((route, index) => {
        const { options } = descriptors?.[route.key] || {};
        const isFocused = state.index === index;
        const onPress = () => {
            const event = navigation?.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });
            
            if (!isFocused && !
                event?.defaultPrevented) {
                navigation?.navigate(route.name);
            }
        };
        return (
            <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={[navigationBarStyle.inactiveTab, isFocused ? navigationBarStyle.activeTab : null]}
            >
                {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: isFocused ? '#ffffff' : '#000000', size: isFocused ? 24 : 20 })}
            </TouchableOpacity>
        );
    });
}

export const NavigationBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const [isRecording, setIsRecording] = useState(false);

    function togglePressIn() {
        setIsRecording(true);
        // TODO: Add start recording logic here
    }

    function togglePressOut() {
        setIsRecording(false);

        // TODO: Add stop recording logic here
    }

    return (
        <View style={navigationBarStyle.container}>
            <View style={[navigationBarStyle.tabBar, (state.index === 0) ? { width: '80%' } : { width: '100%' }]}>
                {genarateTabBar(state, descriptors, navigation)}
            </View>
            {(state.index === 0) && (
                <TouchableOpacity
                    style={navigationBarStyle.voiceButton}
                    onPressIn={togglePressIn}
                    onPressOut={togglePressOut}
                >
                    <Image
                        source={isRecording ? require('@assets/icons/navbar_stop_record_icon.png') : require('@assets/icons/navbar_record_icon.png')}
                        style={navigationBarStyle.voiceIcon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

