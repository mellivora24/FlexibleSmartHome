import { EventList } from '@src/domain/model/Event';
import { SensorData } from '@src/domain/model/SensorData';

export const mockSensorData: SensorData[] = [
  {
    id: 1,
    sensorName: 'Temperature Sensor',
    value: 24.5,
    unit: '°C',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
  },
  {
    id: 2,
    sensorName: 'Humidity Sensor',
    value: 61.2,
    unit: '%',
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 phút trước
  },
  {
    id: 3,
    sensorName: 'Pressure Sensor',
    value: 1012.7,
    unit: 'hPa',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 phút trước
  },
  {
    id: 4,
    sensorName: 'Wind Speed Sensor',
    value: 12.8,
    unit: 'm/s',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 phút trước
  },
];

export const mockEventList: EventList = {
  total: 4,
  list: [
    {
      id: 101,
      deviceName: 'Smart Lamp',
      action: 'TURN_ON',
      payload: { brightness: 80 },
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 phút trước
    },
    {
      id: 102,
      deviceName: 'Air Conditioner',
      action: 'SET_TEMPERATURE',
      payload: { temperature: 26 },
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: 103,
      deviceName: 'Door Lock',
      action: 'LOCK',
      payload: { status: 'locked' },
      createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    },
    {
      id: 104,
      deviceName: 'Smart Lamp',
      action: 'TURN_OFF',
      payload: { reason: 'schedule' },
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
  ],
};
