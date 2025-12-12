import { Tabs } from "expo-router";
import { Image, View } from "react-native";

import { NavigationBar } from "@components/NavigationBar";
import { TAB_ICON } from "@constants/images";

export default function Layout() {
  return (
    <View style={{
      flex: 1,
    }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { display: "none" }
        }}
        tabBar={(props) => <NavigationBar {...props} />}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={focused ? TAB_ICON.DASHBOARD_ACTIVE : TAB_ICON.DASHBOARD_INACTIVE}
                style={{ width: size, height: size, tintColor: color, resizeMode: 'contain' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="device"
          options={{
            title: "Thiết bị",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={focused ? TAB_ICON.DEVICE_ACTIVE : TAB_ICON.DEVICE_INACTIVE}
                style={{ width: size, height: size, tintColor: color, resizeMode: 'contain' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sensor"
          options={{
            title: "Cảm biến",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={focused ? TAB_ICON.SENSOR_ACTIVE : TAB_ICON.SENSOR_INACTIVE}
                style={{ width: size, height: size, tintColor: color, resizeMode: 'contain' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="event"
          options={{
            title: "Sự kiện",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={focused ? TAB_ICON.EVENT_ACTIVE : TAB_ICON.EVENT_INACTIVE}
                style={{ width: size, height: size, tintColor: color, resizeMode: 'contain' }}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
