export interface MCU {
    id: number;
    uid: number;
    mcuCode: number;
    availablePort: number[];
    firmwareVersion: string;
    CreatedAt: Date;
}

export interface CreateMCURequest {
    mcu_code: number;
    firmware_version: string;
}

export interface UpdateMCURequest {
    id: number;
    uid?: number;
    mcuCode?: number;
    availablePort?: number[];
    firmwareVersion?: string;
}
