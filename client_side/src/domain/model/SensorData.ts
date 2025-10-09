export interface SensorDataDB {
  id: number
  uid: number
  did: number
  value: number
  unit: string
  createdAt: string
}

export interface SensorDataItem {
  id: number
  did: number
  sensorName: string
  value: number
  unit: string
  createdAt: string
}

export interface GetListSensorRequest {
  did?: number
  name?: string
  value?: number
  time?: string
  page?: number
  limit?: number
  sortBy?: string
  sortType?: "asc" | "desc"
  startTime?: string
  endTime?: string
}

export interface GetOneSensorRequest {
  id?: number
  did?: number
  value?: number
  atTime?: string
}

export interface GetListSensorResponse {
  data: SensorDataDB[]
  success: boolean
}
