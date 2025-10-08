export interface Device {
    id: number,
    uid: number,
    mid: number,
    rid: number,
    name: string,
    type: string | "digitalDevice" | "analogDevice",
    port: number,
    status: boolean,
    Data: DeviceData,
    RunningTime: number,
    CreatedAt: Date,
    UpdatedAt: Date,
}

export type DeviceData = { status?: boolean, value?: number };

export interface CreateDeviceRequest {
    "mid": number,
    "rid": number,
    "name": string,
    "type": string,
    "port": number,
}

export interface UpdateDeviceRequest {
    "id": number,
    "mid"?: number,
    "rid"?: number,
    "name"?: string,
    "type"?: string,
    "port"?: number,
    "status"?: boolean,
    "Data"?: DeviceData,
    "RunningTime"?: number,
}
