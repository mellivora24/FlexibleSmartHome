import { Tabs } from "expo-router";
import { Image } from "react-native";

import { NavigationBar } from "@components/NavigationBar";
import { ICONS } from "@constants/images";

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { display: "none" }
            }}
            tabBar={(props) => <NavigationBar {...props}/> }
        >
          <Tabs.Screen name="dashboard" options={{
            title: "Dashboard",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused ? ICONS.PASSWORD : ICONS.EMAIL
                }
                style={{ width: size, height: size, tintColor: color }}
              />
            )
          }} />
          <Tabs.Screen name="device" options={{ title: "Thiết bị" }} />
        </Tabs>
    );
}
