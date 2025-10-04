export interface SensorData {
  id: number;
  sensorName: string;
  value: number;
  unit: string;
  createdAt: string;
}

export interface SensorDataList {
  total: number;
  list: SensorData[];
}