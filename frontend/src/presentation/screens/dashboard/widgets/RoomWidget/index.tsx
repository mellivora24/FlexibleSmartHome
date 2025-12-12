import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { Device } from "@domain/model/Device";
import { dashboardStyle } from "@screens/dashboard/style/dashboardStyle";
import { DeviceCard } from "./components/DeviceCard";
import { RoomTabBar } from "./components/RoomTabBar";

interface RoomWidgetProps {
    devices: Device[];
}

export const RoomWidget: React.FC<RoomWidgetProps> = ({ devices }) => {
    const { t } = useTranslation();
    const [activeRoomIndex, setActiveRoomIndex] = useState(0);

    const handleRoomPress = (index: number) => {
        setActiveRoomIndex(index);
    };

    const filteredDevices = useMemo(() => {
        return devices.filter(
            (device) =>
                device.rid === activeRoomIndex &&
                device.type !== "temperatureSensor" &&
                device.type !== "humiditySensor"
        );
    }, [devices, activeRoomIndex]);

    return (
        <View style={{ flex: 1 }}>
            <RoomTabBar onTabChange={handleRoomPress} />

            {filteredDevices.length === 0 ? (
                <View style={dashboardStyle.noDeviceContainer}>
                    <Text style={dashboardStyle.noDeviceText}>
                        {t("dashboard.roomWidget.noDevice", {
                            defaultValue: "Không có thiết bị trong phòng này",
                        })}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {filteredDevices.map((device) => (
                        <View key={device.id} style={{ marginRight: 12 }}>
                            <DeviceCard device={device} />
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
