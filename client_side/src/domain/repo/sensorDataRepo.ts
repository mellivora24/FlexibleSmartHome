import { sensorDataApi } from '@infra/api/http/sensorDataApi';
import { GetListSensorRequest, GetListSensorResponse } from '../model/SensorData';

export interface SensorDataRepository {
  getList(params: GetListSensorRequest, token: string): Promise<GetListSensorResponse>;
  getListByDID(did: number, limit: number, token: string): Promise<GetListSensorResponse>;
}

export class SensorDataRepositoryImpl implements SensorDataRepository {
  async getList(params: GetListSensorRequest, token: string): Promise<GetListSensorResponse> {
    return sensorDataApi.getList(params, token);
  }

  async getListByDID(did: number, limit: number, token: string): Promise<GetListSensorResponse> {
    return sensorDataApi.getListByDID(did, limit, token);
  }
}
