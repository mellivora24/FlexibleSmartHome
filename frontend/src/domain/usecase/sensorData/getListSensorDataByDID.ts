import { SensorDataRepository } from "@domain/repo/sensorDataRepo";
import { GetListSensorResponse } from "@model/SensorData";

export class GetListSensorDataByDID {
    constructor(private repo: SensorDataRepository) { }

    async execute(did: number, limit: number, token: string): Promise<GetListSensorResponse> {
        return this.repo.getListByDID(did, limit, token);
    }
}
