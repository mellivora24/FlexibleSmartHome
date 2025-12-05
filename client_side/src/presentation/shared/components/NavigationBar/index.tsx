import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: isFocused ? '#fff' : '#000', size: isFocused ? 24 : 20 })}
                    {options.title && isFocused && <Text style={{ color: isFocused ? '#fff' : '#000', fontSize: isFocused ? 14 : 12, marginTop: 4, marginLeft: 8 }}>{options.title}</Text>}
                </View>
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
            <View style={[navigationBarStyle.tabBar, (state.index === 0) ? { width: '90%' } : { width: '100%' }]}>
                {genarateTabBar(state, descriptors, navigation)}
            </View>
            {/* {(state.index === 0) && (
                <TouchableOpacity
                    style={navigationBarStyle.voiceButton}
                    onPressIn={togglePressIn}
                    onPressOut={togglePressOut}
                >
                    <Image
                        source={isRecording ? ICONS.STOP_RECORD : ICONS.RECORD}
                        style={navigationBarStyle.voiceIcon}
                    />
                </TouchableOpacity>
            )} */}
        </View>
    );
};

