import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { chartWidgetStyle } from "./chartWidgetStyle";

export interface ChartWidgetProps {
    humidity: number[];
    temperature: number[];
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ temperature, humidity }) => {
    const { t } = useTranslation();
    const labels = temperature.map((_, i) => i.toString());

    return (
        <View style={chartWidgetStyle.container}>
            <LineChart
                data={{
                    labels,
                    datasets: [
                        { data: temperature, color: () => "#3CC3DF", strokeWidth: 1 },
                        { data: humidity, color: () => "#FFAE4C", strokeWidth: 1 },
                    ],
                    legend: [t("dashboard.chartWidget.temperature"), t("dashboard.chartWidget.humidity")],
                }}
                chartConfig={{
                    decimalPlaces: 0,
                    propsForDots: { r: "2" },
                    style: { borderRadius: 8 },
                    backgroundColor: "#f5f5f5",
                    backgroundGradientTo: "#f5f5f5",
                    backgroundGradientFrom: "#f5f5f5",
                    color: (opacity = 1) => `rgba(34, 94, 168, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                height={200}
                yAxisInterval={1}
                withShadow={true}
                withInnerLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                style={chartWidgetStyle.chartStyle}
                width={Dimensions.get("window").width - 32 }
            />
        </View>
    );
};
