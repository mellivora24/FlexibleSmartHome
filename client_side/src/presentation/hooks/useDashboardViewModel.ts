import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { Device } from "@domain/model/Device";
import { WeatherData } from "@domain/model/Weather";
import { WeatherRepositoryImpl } from "@domain/repo/weatherRepo";
import { GetWeatherUseCase } from "@domain/usecase/weather/getUsecase";
import { DeviceRepositoryImpl } from "@src/domain/repo/deviceRepo";
import { GetAllDevices } from "@src/domain/usecase/device/getAllDevices";

const weatherRepository = new WeatherRepositoryImpl();
const getWeatherUseCase = new GetWeatherUseCase(weatherRepository);

const deviceRepository = new DeviceRepositoryImpl();
const getAllDevices = new GetAllDevices(deviceRepository);

export const useDashboardViewModel = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<string>("Ha Noi, Viet Nam");

    const [devices, setDevices] = useState<Device[]>([]);
    const [insideHumidity, setInsideHumidity] = useState(60);
    const [insideTemperature, setInsideTemperature] = useState(25);
    const [humidityHistory, setHumidityHistory] = useState<number[]>([0]);
    const [temperatureHistory, setTemperatureHistory] = useState<number[]>([0]);

    const fetchWeather = async (latitude: number, longitude: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherUseCase.execute(latitude, longitude);
            setWeather(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    const fetchDevices = async () => {
        const devices = await getAllDevices.execute();
        setDevices(devices);
    };

    const fetchHumidityHistory = async () => {
        const mockHumidityHistory = [55, 56, 57, 58, 59, 60, 30];
        setHumidityHistory(mockHumidityHistory);
    };

    const fetchTemperatureHistory = async () => {
        const mockTemperatureHistory = [22, 23, 24, 25, 26, 27, 22];
        setTemperatureHistory(mockTemperatureHistory);
    };

    const handleDevicePress = (deviceId: number) => {
        console.log(`Device ${deviceId} pressed`);
    };

    const handleDeviceValueChange = (deviceId: number, newValue: number) => {
        console.log(`Device ${deviceId} changed to ${newValue}`);
    };

    useEffect(() => {
        fetchWeather(21.0278, 105.8342);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchDevices();
            fetchHumidityHistory();
            fetchTemperatureHistory();

            return () => {};
        }, [])
    );

    return {
        weather,
        location,
        loading,
        error,

        insideHumidity,
        insideTemperature,
        temperatureHistory,
        humidityHistory,

        devices,
        handleDevicePress,
        handleDeviceValueChange,
    };
};
