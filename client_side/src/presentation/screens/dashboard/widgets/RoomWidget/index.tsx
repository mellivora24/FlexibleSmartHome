import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Device } from '@domain/entities/Device';
import { dashboardStyle } from '@screens/dashboard/style/dashboardStyle';
import { DeviceCard } from './components/DeviceCard';
import { RoomTabBar } from './components/RoomTabBar';

interface RoomWidgetProps {
  devices: Device[];
}

export const RoomWidget: React.FC<RoomWidgetProps> = ({ devices }) => {
  const { t } = useTranslation();
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  const handleRoomPress = (index: number) => {
      setActiveRoomIndex(index);
  };

  const filteredDevices = devices.filter((device) => device.rid === activeRoomIndex);

  return (
    <View style={{ flex: 1 }}>
      <RoomTabBar 
        onTabChange={handleRoomPress}
      />
      {filteredDevices.length === 0 ? (
        <View style={dashboardStyle.noDeviceContainer}>
          <Text style={dashboardStyle.noDeviceText}>
            {t('dashboard.roomWidget.noDevice', { defaultValue: 'Không có thiết bị trong phòng này' })}
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, padding: 10 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))
          ) : (
            <View style={dashboardStyle.noDeviceContainer}>
              <Text style={dashboardStyle.noDeviceText}>{t('dashboard.noDevice.message')}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};
