import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { Device } from "@domain/model/Device";
import { WeatherData } from "@domain/model/Weather";
import { SensorDataRepositoryImpl } from "@domain/repo/sensorDataRepo";
import { WeatherRepositoryImpl } from "@domain/repo/weatherRepo";
import { GetListSensorDataByDID } from "@domain/usecase/sensorData/getListSensorDataByDID";
import { GetWeatherUseCase } from "@domain/usecase/weather/getUsecase";
import { DeviceRepositoryImpl } from "@src/domain/repo/deviceRepo";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";
import { addSocketListener, initSocket, removeSocketListener } from "@src/infra/api/websocket/socketClient";

type WSMessage = { topic: string; payload: any };

const weatherRepo = new WeatherRepositoryImpl();
const getWeather = new GetWeatherUseCase(weatherRepo);

const deviceRepo = new DeviceRepositoryImpl();
const getDevices = new GetAllDevices(deviceRepo);

const sensorRepo = new SensorDataRepositoryImpl();
const getSensorData = new GetListSensorDataByDID(sensorRepo);

export const useDashboardViewModel = (token: string) => {
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
                    setInsideHumidity(values.at(-1) ?? null);
                }

                if (temperatureData.success && temperatureData.data.length > 0) {
                    const values = temperatureData.data.map(item => item.value).reverse();
                    setTemperatureHistory(values);
                    setInsideTemperature(values.at(-1) ?? null);
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

        const handleWS = (msg: WSMessage) => {
            if (msg.topic === "sensor_data") {
                const { did, value } = msg.payload;
                const device = devices.find(d => d.id === did);

                if (!device) return;

                if (device.type === "humiditySensor") {
                    setInsideHumidity(value);
                    setHumidityHistory(prev => [...prev.slice(-9), value]);
                }

                if (device.type === "temperatureSensor") {
                    setInsideTemperature(value);
                    setTemperatureHistory(prev => [...prev.slice(-9), value]);
                }
            }
        };

        addSocketListener(handleWS);
        fetchWeather();

        return () => {
            removeSocketListener(handleWS);
            console.log("WebSocket listener removed");
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
