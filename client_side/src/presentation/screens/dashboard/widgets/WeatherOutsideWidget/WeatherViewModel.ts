import { useState } from "react";

import { WeatherData } from "@src/domain/model/Weather";
import { WeatherRepositoryImpl } from "@src/domain/repo/weatherRepo";
import { GetWeatherUseCase } from "@src/domain/usecase/weather/getUsecase";

const weatherRepository = new WeatherRepositoryImpl();
const getWeatherUseCase = new GetWeatherUseCase(weatherRepository);

export const useWeatherViewModel = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    return {
        weather,
        loading,
        error,
        fetchWeather
    };
};
