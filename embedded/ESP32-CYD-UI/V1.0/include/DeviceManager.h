#pragma once

#include <map>
#include <vector>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include "widget/WidgetCard.h"
#include "widget/DigitalDevice.h"
#include "widget/DigitalSensor.h"
#include "widget/AnalogDevice.h"
#include "widget/AnalogSensor.h"
#include "MQTT_CONF.h"

typedef void (*DeviceChangeCallback)(int deviceId, String type, int value);

class DeviceManager {
private:
    PubSubClient* mqttClient;
    DeviceChangeCallback changeCallback;

    std::map<int, WidgetCard*> widgetMap;

public:
    struct DeviceInfo {
        int id;
        String name;
        String type;
        int port;
    };
    std::map<int, DeviceInfo> deviceInfoMap;

    DeviceManager(PubSubClient* client) 
        : mqttClient(client), changeCallback(nullptr) {}

    void registerWidget(int deviceId, WidgetCard* widget, String name, String type, int port) {
        widgetMap[deviceId] = widget;
        deviceInfoMap[deviceId] = {deviceId, name, type, port};
    }
    
    // Lấy danh sách device ID theo type
    std::vector<int> getDeviceIdsByType(String type) {
        std::vector<int> result;
        for (auto& pair : deviceInfoMap) {
            if (pair.second.type == type) {
                result.push_back(pair.first);
            }
        }
        return result;
    }

    void updateFromMQTT(int deviceId, int value) {
        if (widgetMap.find(deviceId) == widgetMap.end()) return;
        
        WidgetCard* widget = widgetMap[deviceId];
        String type = deviceInfoMap[deviceId].type;
        
        if (type == "temperatureSensor" || type == "humiditySensor" || type == "analogSensor") {
            AnalogSensor* sensor = static_cast<AnalogSensor*>(widget);
            sensor->setValue(value);
            sensor->render();
        }
    }
    
    void updateFromMQTT(int deviceId, bool status) {
        if (widgetMap.find(deviceId) == widgetMap.end()) return;
        
        WidgetCard* widget = widgetMap[deviceId];
        String type = deviceInfoMap[deviceId].type;
        
        if (type == "gasSensor" || type == "digitalSensor") {
            DigitalSensor* sensor = static_cast<DigitalSensor*>(widget);
            sensor->setStatus(status);
            sensor->render();
        }
        else if (type == "digitalDevice") {
            DigitalDevice* device = static_cast<DigitalDevice*>(widget);
            device->setState(status);
        }
        else if (type == "analogDevice") {
            AnalogDevice* device = static_cast<AnalogDevice*>(widget);
            device->setStatus(status);
            device->render();
        }

        JsonDocument doc;
        doc["topic"] = "control_response";

        JsonObject payload = doc["payload"].to<JsonObject>();
        payload["did"] = deviceId;
        payload["value"] = status ? 1 : 0;
        payload["status"] = "success";
        payload["command"] = status ? "ON" : "OFF";

        String output;
        serializeJson(doc, output);

        mqttClient->publish(MQTT_TOPIC_PUB_CONTROL_RESP, output.c_str());
    }

    void updateLevel(int deviceId, int level) {
        if (widgetMap.find(deviceId) == widgetMap.end()) return;
        
        WidgetCard* widget = widgetMap[deviceId];
        String type = deviceInfoMap[deviceId].type;
        
        if (type == "analogDevice") {
            AnalogDevice* device = static_cast<AnalogDevice*>(widget);
            device->setLevel(level);
            device->render();
        }
    }

    bool getDigitalDeviceState(int deviceId) {
        if (widgetMap.find(deviceId) == widgetMap.end()) return false;
        
        WidgetCard* widget = widgetMap[deviceId];
        String type = deviceInfoMap[deviceId].type;
        
        if (type == "digitalDevice") {
            DigitalDevice* device = static_cast<DigitalDevice*>(widget);
            return device->getState();
        }
        else if (type == "analogDevice") {
            AnalogDevice* device = static_cast<AnalogDevice*>(widget);
            return device->getStatus();
        }
        
        return false;
    }
    
    int getAnalogDeviceLevel(int deviceId) {
        if (widgetMap.find(deviceId) == widgetMap.end()) return 0;
        
        WidgetCard* widget = widgetMap[deviceId];
        String type = deviceInfoMap[deviceId].type;
        
        if (type == "analogDevice") {
            AnalogDevice* device = static_cast<AnalogDevice*>(widget);
            return device->getLevel();
        }
        
        return 0;
    }
    
    void setChangeCallback(DeviceChangeCallback callback) {
        changeCallback = callback;
    }
    
    void notifyDeviceChanged(int deviceId) {
        if (changeCallback && widgetMap.find(deviceId) != widgetMap.end()) {
            String type = deviceInfoMap[deviceId].type;
            int value = 0;
            
            if (type == "digitalDevice") {
                value = getDigitalDeviceState(deviceId) ? 1 : 0;
            }
            else if (type == "analogDevice") {
                value = getAnalogDeviceLevel(deviceId);
            }
            
            changeCallback(deviceId, type, value);
        }
    }

    void publishDeviceState(int deviceId) {
        if (!mqttClient || widgetMap.find(deviceId) == widgetMap.end()) return;
        
        DeviceInfo info = deviceInfoMap[deviceId];
        
        JsonDocument doc;
        doc["topic"] = "control_response";

        JsonObject payload = doc["payload"].to<JsonObject>();
        payload["did"] = deviceId;
        
        if (info.type == "digitalDevice") {
            bool state = getDigitalDeviceState(deviceId);
            payload["command"] = state ? "ON" : "OFF";
            payload["value"] = state ? 1 : 0;
            payload["status"] = "success";
        }
        else if (info.type == "analogDevice") {
            bool state = getDigitalDeviceState(deviceId);
            int level = getAnalogDeviceLevel(deviceId);
            payload["command"] = state ? "ON" : "OFF";
            payload["value"] = level;
            payload["status"] = "success";
        }
        
        String output;
        serializeJson(doc, output);
        mqttClient->publish(MQTT_TOPIC_EMBEDDED_CONTROL_SEND, output.c_str());
    }

    void publishSensorData(int deviceId, float value, String unit = "%") {
        if (!mqttClient || widgetMap.find(deviceId) == widgetMap.end()) return;
        
        if (widgetMap.find(deviceId) != widgetMap.end()) {
            WidgetCard* widget = widgetMap[deviceId];
            String type = deviceInfoMap[deviceId].type;

            if (type == "temperatureSensor" || type == "humiditySensor" || type == "analogSensor") {
                AnalogSensor* sensor = static_cast<AnalogSensor*>(widget);
                sensor->setValue((int)value);
            }
        }

        JsonDocument doc;
        doc["topic"] = "sensor_data";

        JsonObject payload = doc["payload"].to<JsonObject>();
        payload["did"] = deviceId;
        payload["value"] = value;
        payload["unit"] = unit;
        
        String output;
        serializeJson(doc, output);
        
        mqttClient->publish(MQTT_TOPIC_PUB_DATA, output.c_str());
    }
    
    void publishAlert(String title, String message) {
        if (!mqttClient) return;
        
        JsonDocument doc;
        doc["topic"] = "alert";

        JsonObject payload = doc["payload"].to<JsonObject>();
        payload["title"] = title;
        payload["message"] = message;
        
        String output;
        serializeJson(doc, output);
        
        mqttClient->publish(MQTT_TOPIC_PUB_ALERT, output.c_str());
    }
    
    void clear() {
        widgetMap.clear();
        deviceInfoMap.clear();
    }
};
