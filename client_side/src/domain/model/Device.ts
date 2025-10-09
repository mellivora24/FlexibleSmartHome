export interface Device {
    id: number,
    uid: number,
    mid: number,
    rid: number,
    name: string,
    type: string | "digitalDevice" | "analogDevice" | "digitalSensor" | "analogSensor",
    port: number,
    status: boolean,
    Data: DeviceData,
    RunningTime: number,
    CreatedAt: Date,
    UpdatedAt: Date,
}

export type DeviceData = { status?: boolean, value?: number, unit?: string };

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
    "port"?: number,
    "type"?: string,
    "name"?: string,
    "status"?: boolean
}
