import axios from "axios";

import { API_CONFIG } from "@infra/config/apiConfig";
import { WeatherData } from "@src/domain/model/Weather";

export const weatherApi = {
    getCurrentWeather: async (latitude: number, longitude: number): Promise<WeatherData> => {
        try {
            const url = `${API_CONFIG.WEATHER_API_URL}forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code`;

            console.log("Fetching weather from URL:", url); // Debug line --- IGNORE ---

            const res = await axios.get(url);

            const temperature = res.data.hourly.temperature_2m[0];
            const weathercode = res.data.hourly.weather_code[0];
            const data: WeatherData = { temperature, weathercode };
            
            return data;
        } catch (error) {
            throw new Error("Failed to fetch weather data");
        }
    },
};
