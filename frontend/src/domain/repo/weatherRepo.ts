import { weatherApi } from "@src/infra/api/http/weatherApi";
import { WeatherData } from "../model/Weather";

export interface WeatherRepository {
    getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData>;
}

export class WeatherRepositoryImpl implements WeatherRepository {
    async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
        try {
            return await weatherApi.getCurrentWeather(latitude, longitude);
        } catch (error: any) {
            throw error;
        }
    }
}
