import { GetListSensorRequest, GetListSensorResponse } from "@src/domain/model/SensorData";
import { SensorDataRepository } from "@src/domain/repo/sensorDataRepo";

export class GetListSensorData {
    constructor(private repo: SensorDataRepository) {}

    async execute(params: GetListSensorRequest): Promise<GetListSensorResponse> {
        return this.repo.getList(params);
    }
}
