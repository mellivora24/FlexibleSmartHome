import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { RoomTabBar } from './components/RoomTabBar';

interface Device {
  id: string;
  name: string;
  roomId: number;
}

interface RoomWidgetProps {
  devices: Device[];
}

export const RoomWidget: React.FC<RoomWidgetProps> = ({ devices }) => {
  const { t } = useTranslation();
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  const handleRoomPress = (index: number) => {
    setActiveRoomIndex(index);
  };

  const filteredDevices = devices.filter((device) => device.roomId === activeRoomIndex);

  return (
    <View style={{ flex: 1 }}>
      <RoomTabBar 
        onTabChange={handleRoomPress}
      />
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <View 
              key={device.id} 
              style={{
                padding: 15,
                marginVertical: 8,
                borderRadius: 12,
                backgroundColor: '#f2f2f2',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{device.name}</Text>
              <Text style={{ fontSize: 12, color: '#555' }}>
                {t('Device ID')}: {device.id}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
            {t('No devices in this room')}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
