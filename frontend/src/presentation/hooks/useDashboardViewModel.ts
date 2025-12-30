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
import { WSMessage } from "@model/Websocket";
import { DeviceRepositoryImpl } from "@src/domain/repo/deviceRepo";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";
import { addSocketListener, initSocket } from "@src/infra/api/websocket/socketClient";

const weatherRepo = new WeatherRepositoryImpl();
const getWeather = new GetWeatherUseCase(weatherRepo);

const deviceRepo = new DeviceRepositoryImpl();
const getDevices = new GetAllDevices(deviceRepo);

const sensorRepo = new SensorDataRepositoryImpl();
const getSensorData = new GetListSensorDataByDID(sensorRepo);

const MAX_CHART_POINTS = 10;
const ALERT_COOLDOWN_MS = 30000;

export const useDashboardViewModel = (token: string) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location] = useState("Ha Noi, Viet Nam");

    const lastAlertTimeRef = useState<{ [key: string]: number }>({})[0];

    const [devices, setDevices] = useState<Device[]>([]);
    const [insideHumidity, setInsideHumidity] = useState<number | null>(null);
    const [insideTemperature, setInsideTemperature] = useState<number | null>(null);
    const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
    const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
    const [rainingHistory, setRainingHistory] = useState<number[]>([]);
    const [windSpeedHistory, setWindSpeedHistory] = useState<number[]>([]);

    useEffect(() => {
        const mockRaining = Array.from({ length: MAX_CHART_POINTS }, () => Math.floor(Math.random() * 100));
        const mockWindSpeed = Array.from({ length: MAX_CHART_POINTS }, () => Math.floor(Math.random() * 50));
        setRainingHistory(mockRaining);
        setWindSpeedHistory(mockWindSpeed);
    }, []);

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
                const rainingDeviceID = deviceList.find(d => d.type === "rainingSensor")?.id;
                const windSpeedDeviceID = deviceList.find(d => d.type === "windSpeedSensor")?.id;

                const humidityData = await getSensorData.execute(humiDeviceID, 10, token);
                const temperatureData = await getSensorData.execute(tempDeviceID, 10, token);
                const rainingData = await getSensorData.execute(rainingDeviceID, 10, token);
                const windSpeedData = await getSensorData.execute(windSpeedDeviceID, 10, token);

                if (humidityData.total && humidityData.list.length > 0) {
                    const values = humidityData.list.map(item => item.value).reverse();
                    setHumidityHistory(values);
                }

                if (temperatureData.total && temperatureData.list.length > 0) {
                    const values = temperatureData.list.map(item => item.value).reverse();
                    setTemperatureHistory(values);
                }

                if (rainingData.total && rainingData.list.length > 0) {
                    const values = rainingData.list.map(item => item.value).reverse();
                    setRainingHistory(values);
                }

                if (windSpeedData.total && windSpeedData.list.length > 0) {
                    const values = windSpeedData.list.map(item => item.value).reverse();
                    setWindSpeedHistory(values);
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

        const handleSensorData = (msg: WSMessage) => {
            const { did, value } = msg.payload;
            const device = devices.find(d => d.id === did);

            if (!device) return;
            
            if (device.type === "humiditySensor") {
                setInsideHumidity(value);
                setHumidityHistory(prev => {
                    const newHistory = [...prev, value];
                    if (newHistory.length > MAX_CHART_POINTS) {
                        return newHistory.slice(newHistory.length - MAX_CHART_POINTS);
                    }
                    return newHistory;
                });
            }

            if (device.type === "temperatureSensor") {
                setInsideTemperature(value);
                setTemperatureHistory(prev => {
                    const newHistory = [...prev, value];
                    if (newHistory.length > MAX_CHART_POINTS) {
                        return newHistory.slice(newHistory.length - MAX_CHART_POINTS);
                    }
                    return newHistory;
                });
            }

            if (device.type === "analogSensor" && device.name.toLowerCase().includes("mưa")) {
                setRainingHistory(prev => {
                    const newHistory = [...prev, value];
                    if (newHistory.length > MAX_CHART_POINTS) {
                        return newHistory.slice(newHistory.length - MAX_CHART_POINTS);
                    }
                    return newHistory;
                });
            }
            
            if (device.type === "analogSensor" && device.name.toLowerCase().includes("gió")) {
                setWindSpeedHistory(prev => {
                    const newHistory = [...prev, value];
                    if (newHistory.length > MAX_CHART_POINTS) {
                        return newHistory.slice(newHistory.length - MAX_CHART_POINTS);
                    }
                    return newHistory;
                });
            }
        };

        const handleAlert = (msg: WSMessage) => {
            const { title, message } = msg.payload;
            const alertKey = `${title}:${message}`;
            const now = Date.now();
            
            if (lastAlertTimeRef[alertKey] && (now - lastAlertTimeRef[alertKey]) < ALERT_COOLDOWN_MS) {
                console.log(`[Alert] Skipping duplicate alert (cooldown active): ${message}`);
                return;
            }

            lastAlertTimeRef[alertKey] = now;
            
            const pattern = [0, 100, 200, 500];
            Vibration.vibrate(pattern, true);

            Alert.alert(
                title || t("common.alert"),
                message,
                [
                    {
                        text: t("common.ok"),
                        onPress: () => Vibration.cancel(),
                    },
                ],
                { cancelable: false }
            );
        };

        const unsubscribeSensor = addSocketListener(handleSensorData, "sensor_data");
        const unsubscribeAlert = addSocketListener(handleAlert, "alert");
        
        fetchWeather();

        return () => {
            unsubscribeSensor();
            unsubscribeAlert();
        };
    }, [devices, token, fetchWeather, t]);

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
        rainingHistory,
        windSpeedHistory,
    };
};
