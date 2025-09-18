export interface Device {
    id: number,
    uid: number,
    mid: number,
    rid: number,
    name: string,
    type: string,
    port: number,
    status: boolean,
    Data: DeviceData,
    RunningTime: number,
    CreatedAt: Date,
    UpdatedAt: Date,
}

export type DeviceType = 'digitalDevice' | 'analogDevice' | 'digitalSensor' | 'analogSensor';

export type DeviceData = 
    | { onOff: boolean; } // Digital Device
    | { onOff: boolean, pwm: number; unit?: string } // Analog Device
    | { signal: boolean; } // Digital Sensor
    | { value: number; unit?: string }; // Analog Sensor
