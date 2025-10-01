#pragma once
#include <vector>
#include <string>
#include "../src/model/Device.h"
#include "../src/model/Sensor.h"
#include "../src/model/SensorData.h"
#include "../src/model/Event.h"
#include "../src/model/Notification.h"
#include "../src/model/MQTT_DataPackages.h"

const std::vector<Device> mockDevices = {
    {"dev001", "Living Room Light", "digitalDevice", true},
    {"dev002", "Bedroom Thermostat", "analogDevice", false},
    {"dev003", "Outdoor Camera", "digitalDevice", true}
};

const std::vector<Sensor> mockSensors = {
    {1, 0, 0, 0, "Temperature Sensor", "analogSensor", 0, true, 0},
    {2, 0, 0, 0, "Humidity Sensor", "analogSensor", 0, true, 0},
    {3, 0, 0, 0, "Motion Sensor", "digitalSensor", 0, false, 0}
};
