import { GetListSensorResponse } from "@src/domain/model/SensorData";
import { SensorDataRepository } from "@src/domain/repo/sensorDataRepo";

export class GetByIDAndValue {
    constructor(private repo: SensorDataRepository) {}

    async execute(did: number, value: number, token: string): Promise<GetListSensorResponse> {
        return this.repo.getByDIDAndValue(did, value, token);
    }
}
