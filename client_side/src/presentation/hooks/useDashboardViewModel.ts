import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Vibration } from "react-native";

import { Device } from "@domain/model/Device";
import { WeatherData } from "@domain/model/Weather";
import { SensorDataRepositoryImpl } from "@domain/repo/sensorDataRepo";
import { WeatherRepositoryImpl } from "@domain/repo/weatherRepo";
import { GetListSensorDataByDID } from "@domain/usecase/sensorData/getListSensorDataByDID";
import { GetWeatherUseCase } from "@domain/usecase/weather/getUsecase";
import { DeviceRepositoryImpl } from "@src/domain/repo/deviceRepo";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";
import { initSocket, addTopicListener, removeTopicListener } from "@src/infra/api/websocket/socketClient";

const weatherRepo = new WeatherRepositoryImpl();
const getWeather = new GetWeatherUseCase(weatherRepo);

const deviceRepo = new DeviceRepositoryImpl();
const getDevices = new GetAllDevices(deviceRepo);

const sensorRepo = new SensorDataRepositoryImpl();
const getSensorData = new GetListSensorDataByDID(sensorRepo);

export const useDashboardViewModel = (token: string) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location] = useState("Ha Noi, Viet Nam");

    const [devices, setDevices] = useState<Device[]>([]);
    const [insideHumidity, setInsideHumidity] = useState<number | null>(null);
    const [insideTemperature, setInsideTemperature] = useState<number | null>(null);
    const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
    const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);

    const fetchWeather = useCallback(async () => {
        try {
            const data = await getWeather.execute(21.0278, 105.8342);
            setWeather(data);
        } catch (err: any) {
            setError(err.message ?? "Failed to fetch weather data");
        }
    }, []);

    const fetchDevicesAndSensors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const deviceList = await getDevices.execute(token);
            setDevices(deviceList);

            if (deviceList.length > 0) {
                const humiDeviceID = deviceList.find(d => d.type === "humiditySensor")?.id;
                const tempDeviceID = deviceList.find(d => d.type === "temperatureSensor")?.id;

                const humidityData = await getSensorData.execute(humiDeviceID, 10, token);
                const temperatureData = await getSensorData.execute(tempDeviceID, 10, token);

                if (humidityData.success && humidityData.data.length > 0) {
                    const values = humidityData.data.map(item => item.value).reverse();
                    setHumidityHistory(values);
                }

                if (temperatureData.success && temperatureData.data.length > 0) {
                    const values = temperatureData.data.map(item => item.value).reverse();
                    setTemperatureHistory(values);
                }
            }
        } catch (err: any) {
            setError(err.message ?? "Failed to fetch devices or sensors");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDevicesAndSensors();
    }, [fetchDevicesAndSensors]);

    useEffect(() => {
        if (devices.length === 0) return;

        initSocket(token);

        const handleSensorData = (payload: { did: string; value: number }) => {
            const { did, value } = payload;
            const device = devices.find(d => d.id === did);
            if (!device) return;
            if (device.type === "humiditySensor") {
                setInsideHumidity(value);
            }
            if (device.type === "temperatureSensor") {
                setInsideTemperature(value);
            }
        };

        const handleAlert = (payload: { message: string }) => {
            const pattern = [0, 100, 200, 500];
            Vibration.vibrate(pattern, true);
            Alert.alert(
                t("common.alert"),
                payload.message,
                [
                    {
                        text: t("common.ok"),
                        onPress: () => Vibration.cancel(),
                    },
                ],
                { cancelable: false }
            );
        };

        addTopicListener("sensor_data", handleSensorData);
        addTopicListener("alert", handleAlert);
        fetchWeather();

        return () => {
            removeTopicListener("sensor_data", handleSensorData);
            removeTopicListener("alert", handleAlert);
            console.log("WebSocket topic listeners removed");
        };
    }, [devices, token, fetchWeather]);

    useFocusEffect(
        useCallback(() => {
            fetchDevicesAndSensors();
        }, [fetchDevicesAndSensors])
    );

    return {
        loading,
        error,
        location,
        weather,
        devices,
        insideHumidity,
        insideTemperature,
        humidityHistory,
        temperatureHistory,
    };
};
