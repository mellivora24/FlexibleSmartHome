import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TopBarWidget } from "@components/TopBarWidget";
import { BACKGROUND } from "@theme/colors";
import { dashboardStyle } from "./style/dashboardStyle";
import { ChartWidget } from "./widgets/ChartWidget";
import { HumidityWidget } from "./widgets/HumidityWidget";
import { RoomWidget } from "./widgets/RoomWidget";
import { TemperatureWidget } from "./widgets/TemperatureWidget";
import { WeatherOutsideWidget } from "./widgets/WeatherOutsideWidget";

import { useDashboardViewModel } from "@hooks/useDashboardViewModel";
import { useAuthContext } from "@presentation/hooks/useAppContext";

export const DashboardScreen: React.FC = () => {
    const router = useRouter();
    const { authData, token } = useAuthContext();
    const vm = useDashboardViewModel(token);

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={dashboardStyle.container}>
                <TopBarWidget
                    onAvatarPress={() => router.push("/add-on/account")}
                    onNotificationPress={() => router.push("/add-on/notification")}
                />

                <View style={dashboardStyle.Section1}>
                    <WeatherOutsideWidget weather={vm.weather} loading={vm.loading} location={vm.location} />
                    <View style={dashboardStyle.row}>
                        <HumidityWidget humidity={vm.insideHumidity} />
                        <TemperatureWidget temperature={vm.insideTemperature} />
                    </View>
                </View>

                <View style={dashboardStyle.Section2}>
                    <ChartWidget
                        temperature={vm.temperatureHistory}
                        humidity={vm.humidityHistory}
                    />
                </View>

                <View style={dashboardStyle.Section3}>
                    <RoomWidget
                        devices={vm.devices}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};
