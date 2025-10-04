// MCU (tbl_mcu)
export interface MCU {
  id: number;
  uid: number;
  availablePort: number[]; // danh sách port khả dụng
  firmwareVersion?: string;
  createdAt: string; // ISO date
}

// Room (tbl_room)
export interface Room {
  id: number;
  uid: number;
  name: string;
  description?: string;
  createdAt: string;
}

// Sensor (tbl_sensor)
export interface Sensor {
  id: number;
  uid: number;
  mid: number; // mcu id
  rid?: number; // room id
  name: string;
  type: string; // ví dụ: temperature, gas, smoke...
  port: number;
  status: boolean;
  runningTime: number;
  createdAt: string;
  updatedAt: string;
}

// Device (tbl_device)
export interface Device {
  id: number;
  uid: number;
  mid: number;
  rid?: number;
  name: string;
  type: string; // ví dụ: fan, light, pump...
  port: number;
  status: boolean;
  data?: Record<string, any>; // dữ liệu tùy biến JSONB
  runningTime: number;
  createdAt: string;
  updatedAt: string;
}

// Event (tbl_events)
export interface Event {
  id: number;
  uid: number;
  did?: number; // device id
  action: string; // ví dụ: "turn_on", "turn_off"
  payload?: Record<string, any>; // dữ liệu thêm
  createdAt: string;
}

// SensorData (tbl_sensordata)
export interface SensorData {
  id: number;
  uid: number;
  sid?: number; // sensor id
  value: number;
  unit?: string; // ví dụ: °C, %, ppm
  createdAt: string;
}

// Log (tbl_log)
export interface Log {
  id: number;
  uid?: number;
  level: string; // "info", "warn", "error"
  message: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Notification (tbl_notification)
export interface Notification {
  id: number;
  uid: number;
  type: string; // ví dụ: "system", "alert"
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Pending Action (pending_actions)
export interface PendingAction {
  id: number;
  uid: number;
  mid: number;
  action: string; // ví dụ: "restart", "update"
  status: "pending" | "success" | "failed";
  createdAt: string;
  updatedAt: string;
}
