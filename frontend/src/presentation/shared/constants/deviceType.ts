export const DEVICE_TYPES = {
    DIGITAL_DEVICE: 'digitalDevice',
    ANALOG_DEVICE: 'analogDevice',
    DIGITAL_SENSOR: 'digitalSensor',
    ANALOG_SENSOR: 'analogSensor',
    TEMPERATURE_SENSOR: 'temperatureSensor',
    HUMIDITY_SENSOR: 'humiditySensor',
    DHT11_SENSOR: 'dht11Sensor',
    UNKNOWN_TYPE: 'unknownType',
} as const;

export const DEVICE_TYPE_LIST = [
    DEVICE_TYPES.DIGITAL_DEVICE, 
    DEVICE_TYPES.ANALOG_DEVICE, 
    DEVICE_TYPES.DIGITAL_SENSOR, 
    DEVICE_TYPES.ANALOG_SENSOR, 
    DEVICE_TYPES.DHT11_SENSOR,
    DEVICE_TYPES.UNKNOWN_TYPE
];

