import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { roomTabBarStyle } from './roomTabBarStyle';

interface RoomTabBarProps {
  onTabChange?: (index: number) => void;
}

export const RoomTabBar: React.FC<RoomTabBarProps> = ({ onTabChange }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);

  const defaultTabs = [
    t('dashboard.roomTabBar.livingRoom'),
    t('dashboard.roomTabBar.bedRoom'),
    t('dashboard.roomTabBar.kitchen'),
  ];

  const labels = defaultTabs;

  const handlePress = (index: number) => {
    if (index !== activeTab) {
      setActiveTab(index);
      onTabChange?.(index);
    }
  };

  return (
    <View style={roomTabBarStyle.container}>
      {labels.map((label, index) => (
        <TouchableOpacity
          key={index}
          style={activeTab === index ? roomTabBarStyle.activeTab : roomTabBarStyle.inactiveTab}
          onPress={() => handlePress(index)}
        >
          <Text style={roomTabBarStyle.tabLabel}>
            {activeTab === index ? `${t('dashboard.roomTabBar.prefix', { defaultValue: 'Phòng ' })}${label}` : label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
