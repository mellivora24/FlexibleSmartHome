import { WeatherRepository } from "@src/domain/repo/weatherRepo";

export class GetWeatherUseCase {
    constructor(private weatherRepository: WeatherRepository) {}

    async execute(latitude: number, longitude: number) {
        return await this.weatherRepository.getCurrentWeather(latitude, longitude);
    }
}
