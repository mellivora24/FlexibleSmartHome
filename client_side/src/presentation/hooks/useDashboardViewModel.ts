import { useCallback, useEffect, useState } from "react";

import { Device } from "@domain/model/Device";
import { WeatherData } from "@domain/model/Weather";
import { WeatherRepositoryImpl } from "@domain/repo/weatherRepo";
import { GetWeatherUseCase } from "@domain/usecase/weather/getUsecase";
import { useFocusEffect } from "expo-router";

const weatherRepository = new WeatherRepositoryImpl();
const getWeatherUseCase = new GetWeatherUseCase(weatherRepository);

export const useDashboardViewModel = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<string>("Ha Noi, Viet Nam");

    const [devices, setDevices] = useState<Device[]>([]);
    const [insideHumidity, setInsideHumidity] = useState(60);
    const [insideTemperature, setInsideTemperature] = useState(25);
    const [humidityHistory, setHumidityHistory] = useState<number[]>([55, 56, 57, 58, 59, 60, 61]);
    const [temperatureHistory, setTemperatureHistory] = useState<number[]>([22, 23, 24, 25, 26, 27, 28]);

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
        const mockDevices: Device[] = [
            { id: 0, uid: 1, mid: 1, rid: 0, name: "Living Room Light", type: "digitalDevice", port: 1, status: true, Data: { status: true, value: 1 }, RunningTime: 0, CreatedAt: new Date(), UpdatedAt: new Date() },
            { id: 8, uid: 1, mid: 1, rid: 1, name: "Bedroom Fan", type: "digitalDevice", port: 2, status: false, Data: { status: false, value: 0 }, RunningTime: 0, CreatedAt: new Date(), UpdatedAt: new Date() }
        ];
        setDevices(mockDevices);
    };

    const handleDevicePress = (deviceId: number) => {
        console.log(`Device ${deviceId} pressed`);
    };

    const handleDeviceValueChange = (deviceId: number, newValue: number) => {
        console.log(`Device ${deviceId} changed to ${newValue}`);
    };

    useEffect(() => {
        fetchWeather(21.0278, 105.8342);
        fetchDevices();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchDevices();

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
