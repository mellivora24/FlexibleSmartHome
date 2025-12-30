#include <Arduino.h>

#include <SPI.h>
#include <WiFi.h>
#include <TFT_eSPI.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <XPT2046_Touchscreen.h>

#include "TFT_CONF.h"
#include "MQTT_CONF.h"
#include "WIFI_CONF.h"

#include "widget/TabBar.h"
#include "screen/Screen.h"
#include "widget/WidgetCard.h"
#include "widget/AnalogDevice.h"
#include "widget/AnalogSensor.h"
#include "widget/DigitalDevice.h"
#include "widget/DigitalSensor.h"
#include "DeviceManager.h"

// UART0 for Arduino communication
#define UART_TIMEOUT 1000

TFT_eSPI screen = TFT_eSPI();
SPIClass touchSpi = SPIClass(VSPI);
XPT2046_Touchscreen touchscreen(XPT2046_CS, XPT2046_IRQ);

WiFiClient espClient;
PubSubClient client(espClient);

TabItem tabItems[] = {
    {0, "Home"},
    {1, "Devices"},
};
TabBar tabBar(&screen, tabItems, 2, 0, 30);

Screen homeScreen(&screen, 2, 30);
Screen devicesScreen(&screen, 2, 30);
DeviceManager deviceManager(&client);

int tabId = 0;
std::vector<WidgetCard*> homeWidgets;
std::vector<WidgetCard*> deviceWidgets;

int rainSensorId = -1;
int windSensorId = -1;

bool needsRedraw = false;

String sendArduinoCommand(int pin, int mode, int value = 0) {
    String cmd = "(";
    cmd += String(pin);
    cmd += ",";
    cmd += String(mode);
    if (mode == 1 || mode == 3) {
        cmd += ",";
        cmd += String(value);
    }
    cmd += ")";
    
    while (Serial.available()) {
        Serial.read();
    }
    
    Serial.println(cmd);
    
    unsigned long startTime = millis();
    String response = "";
    
    while (millis() - startTime < UART_TIMEOUT) {
        if (Serial.available()) {
            char c = Serial.read();
            response += c;
            if (c == '\n') {
                break;
            }
        }
        delay(1);
    }
    
    return response;
}

bool parseArduinoResponse(String response, int& value, float& temp, float& hum) {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, response);
    
    if (error) {
        return false;
    }
    
    bool success = doc["success"] | false;
    if (!success) {
        return false;
    }
    
    if (doc["data"].is<JsonObject>()) {
        JsonObject data = doc["data"];
        if (data["value"].is<int>()) {
            value = data["value"];
        }
        if (data["temperature"].is<float>()) {
            temp = data["temperature"];
            hum = data["humidity"];
        }
    }
    
    return true;
}

void controlArduinoDevice(int pin, int mode, int value) {
    String response = sendArduinoCommand(pin, mode, value);
    int dummy = 0;
    float t = 0, h = 0;
    parseArduinoResponse(response, dummy, t, h);
}

void readArduinoSensor(int deviceId, int pin, int mode) {
    String response = sendArduinoCommand(pin, mode);
    int value = 0;
    float temp = 0, hum = 0;
    
    if (parseArduinoResponse(response, value, temp, hum)) {
        if (mode == 5) {
            int tempDeviceId = -1;
            int humDeviceId = -1;
            
            Serial.printf("[DHT11] Searching devices with port %d\n", pin);
            for (auto& pair : deviceManager.deviceInfoMap) {
                Serial.printf("  Device ID=%d, port=%d, type=%s\n", 
                    pair.first, pair.second.port, pair.second.type.c_str());
                    
                if (pair.second.port == pin) {
                    if (pair.second.type == "temperatureSensor") {
                        tempDeviceId = pair.first;
                        Serial.printf("  -> Found temp sensor ID: %d\n", tempDeviceId);
                    } else if (pair.second.type == "humiditySensor") {
                        humDeviceId = pair.first;
                        Serial.printf("  -> Found humidity sensor ID: %d\n", humDeviceId);
                    }
                }
            }
            
            Serial.printf("[DHT11] Read data: temp=%.1f, hum=%.1f\n", temp, hum);
            Serial.printf("[DHT11] Device IDs: tempID=%d, humID=%d\n", tempDeviceId, humDeviceId);
            
            if (tempDeviceId != -1) {
                deviceManager.updateFromMQTT(tempDeviceId, (int)temp);
                deviceManager.publishSensorData(tempDeviceId, temp, "°C");
                Serial.printf("[DHT11] Published temp: %d -> %.1f°C\n", tempDeviceId, temp);
            } else {
                Serial.println("[DHT11] WARNING: Temperature device not found!");
            }
            
            if (humDeviceId != -1) {
                deviceManager.updateFromMQTT(humDeviceId, (int)hum);
                deviceManager.publishSensorData(humDeviceId, hum, "%");
                Serial.printf("[DHT11] Published humidity: %d -> %.1f%%\n", humDeviceId, hum);
            } else {
                Serial.println("[DHT11] WARNING: Humidity device not found!");
            }
        } else if (mode == 2) {
            deviceManager.updateFromMQTT(deviceId, (bool)value);
            deviceManager.publishSensorData(deviceId, value, "");
            Serial.printf("[Digital Sensor] Published: %d -> %d\n", deviceId, value);
            
            if (value == 0) {
                String deviceName = "Unknown";
                if (deviceManager.deviceInfoMap.find(deviceId) != deviceManager.deviceInfoMap.end()) {
                    deviceName = deviceManager.deviceInfoMap[deviceId].name;
                }
                String alertMsg = deviceName + " detected!";
                deviceManager.publishAlert("Digital Sensor Alert", alertMsg);
                Serial.printf("[ALERT] Digital sensor triggered: %s\n", alertMsg.c_str());
            }
        } else if (mode == 4) {
            deviceManager.updateFromMQTT(deviceId, value);
            deviceManager.publishSensorData(deviceId, value, "%");
            Serial.printf("[Analog Sensor] Published: %d -> %d%%\n", deviceId, value);
            
            if (value > 40) {
                String deviceName = "Unknown";
                if (deviceManager.deviceInfoMap.find(deviceId) != deviceManager.deviceInfoMap.end()) {
                    deviceName = deviceManager.deviceInfoMap[deviceId].name;
                }
                String alertMsg = deviceName + " is high: " + String(value) + "%";
                deviceManager.publishAlert("Analog Sensor Alert", alertMsg);
                Serial.printf("[ALERT] Analog sensor high: %s\n", alertMsg.c_str());
            }
        }
    } else {
        Serial.printf("[Sensor] Failed to parse response for pin %d, mode %d\n", pin, mode);
    }
}

void onDeviceChanged(int deviceId, String type, int value) {
    // Get device info from DeviceManager
    if (deviceManager.deviceInfoMap.find(deviceId) == deviceManager.deviceInfoMap.end()) {
        deviceManager.publishDeviceState(deviceId);
        return;
    }
    
    auto deviceInfo = deviceManager.deviceInfoMap[deviceId];
    if (deviceInfo.port > 0) {
        int pin = deviceInfo.port;
        
        if (type == "digitalDevice") {
            // Mode 1: Digital Output
            controlArduinoDevice(pin, 1, value);
        } else if (type == "analogDevice") {
            // Mode 3: PWM Output (map 0-2 level to 0-255)
            int pwmValue = map(value, 0, 2, 0, 255);
            controlArduinoDevice(pin, 3, pwmValue);
        }
    }
    
    deviceManager.publishDeviceState(deviceId);
}

void clearWidgets() {
    for (auto w : homeWidgets) delete w;
    for (auto w : deviceWidgets) delete w;
    homeWidgets.clear();
    deviceWidgets.clear();
    homeScreen.clearWidgets();
    devicesScreen.clearWidgets();
    deviceManager.clear();
    
    rainSensorId = -1;
    windSensorId = -1;
}

void createWidgetFromJson(JsonDocument& doc) {
    clearWidgets();

    JsonArray payload = doc["payload"];

    int col_width = 145, col_height = 190;
    int spacing = 10;
    
    int homeIndex = 0;
    int deviceIndex = 0;

    for (JsonObject item : payload) {
        int id = item["did"] | item["id"];
        String name = item["name"].as<String>();
        String type = item["type"].as<String>();
        int port = item["pin"] | item["port"] | 0;
        
        bool status = false;
        int value = 0;
        int level = 0;
        
        if (item["status"].is<bool>()) status = item["status"];
        if (item["value"].is<int>()) value = item["value"];
        if (item["level"].is<int>()) level = item["level"];

        WidgetCard* widget = nullptr;

        if (type == "digitalDevice") {
            int x = spacing + (deviceIndex % 2) * (col_width + spacing);
            int y = spacing;
            
            DigitalDevice* device = new DigitalDevice(&screen, x, y, col_width, col_height, name.c_str(), 1, id);
            device->setState(status);

            device->setOnStateChangeCallback([](int deviceId) {
                deviceManager.notifyDeviceChanged(deviceId);
            });

            widget = device;
            deviceWidgets.push_back(widget);
            devicesScreen.addWidget(widget);
            deviceManager.registerWidget(id, widget, name, type, port);

            deviceIndex++;

        } 
        else if (type == "analogDevice") {
            int x = spacing + (deviceIndex % 2) * (col_width + spacing);
            int y = spacing;
            
            AnalogDevice* device = new AnalogDevice(&screen, x, y, col_width, col_height, name.c_str(), 1, id);
            device->setStatus(status);
            device->setLevel(level);

            device->setOnStateChangeCallback([](int deviceId) {
                deviceManager.notifyDeviceChanged(deviceId);
            });

            widget = device;
            deviceWidgets.push_back(widget);
            devicesScreen.addWidget(widget);
            deviceManager.registerWidget(id, widget, name, type, port);

            deviceIndex++;
        }

        else if (type == "digitalSensor") {
            int x = spacing + (homeIndex % 2) * (col_width + spacing);
            int y = spacing;
            
            DigitalSensor* sensor = new DigitalSensor(&screen, x, y, col_width, col_height, name.c_str(), 1);
            sensor->setStatus(status);

            widget = sensor;
            homeWidgets.push_back(widget);
            homeScreen.addWidget(widget);
            deviceManager.registerWidget(id, widget, name, type, port);

            homeIndex++;
        } 
        else if (type == "temperatureSensor") {
            int x = spacing + (homeIndex % 2) * (col_width + spacing);
            int y = spacing;
            
            AnalogSensor* sensor = new AnalogSensor(&screen, x, y, col_width, col_height, name.c_str(), 2);
            sensor->setValue(value);
            sensor->setLabel(name + " °C");

            widget = sensor;
            homeWidgets.push_back(widget);
            homeScreen.addWidget(widget);
            deviceManager.registerWidget(id, widget, name, type, port);

            homeIndex++;
        } 
        else if (type == "humiditySensor") {
            int x = spacing + (homeIndex % 2) * (col_width + spacing);
            int y = spacing;
            
            AnalogSensor* sensor = new AnalogSensor(&screen, x, y, col_width, col_height, name.c_str(), 2);
            sensor->setValue(value);
            sensor->setLabel(name + " %");

            widget = sensor;
            homeWidgets.push_back(widget);
            homeScreen.addWidget(widget);
            deviceManager.registerWidget(id, widget, name, type, port);

            homeIndex++;
        } 
        else if (type == "analogSensor") {
            int x = spacing + (homeIndex % 2) * (col_width + spacing);
            int y = spacing;
            
            AnalogSensor* sensor = new AnalogSensor(&screen, x, y, col_width, col_height, name.c_str(), 2);
            sensor->setValue(value);
            sensor->setLabel(name + " %");

            widget = sensor;
            homeWidgets.push_back(widget);
            homeScreen.addWidget(widget);
            deviceManager.registerWidget(id, widget, name, type, port);

            if (name.indexOf("luong mua") != -1 || name.indexOf("mua") != -1) {
                rainSensorId = id;
            }
            if (name.indexOf("gio") != -1) {
                windSensorId = id;
            }

            homeIndex++;
        }
    }

    screen.fillScreen(TFT_WHITE);
    tabBar.draw();
    if (tabId == 0) homeScreen.render();
    else devicesScreen.render();
}

void callback(char* topic, byte* payload, unsigned int length) {
    String message;
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, message);
    if (error) {
        return;
    }

    String msgTopic = doc["topic"].as<String>();
    JsonVariant payloadData = doc["payload"];

    if (String(topic) == MQTT_TOPIC_PUB_CONFIG_RESP && msgTopic == "config") {
        JsonArray devices = payloadData.as<JsonArray>();
        JsonDocument configDoc;
        configDoc["payload"] = devices;
        
        createWidgetFromJson(configDoc);
    } else if (String(topic) == MQTT_TOPIC_SUB_CONTROL_REQ) {
        int deviceId = payloadData["did"];
        String command = payloadData["command"].as<String>();
        bool shouldBeOn = command.equalsIgnoreCase("ON");

        deviceManager.updateFromMQTT(deviceId, shouldBeOn);

        if (deviceManager.deviceInfoMap.find(deviceId) != deviceManager.deviceInfoMap.end()) {
            auto deviceInfo = deviceManager.deviceInfoMap[deviceId];
            int pin = deviceInfo.port;
            String type = deviceInfo.type;
            
            if (pin > 0) {
                if (type == "digitalDevice") {
                    controlArduinoDevice(pin, 1, shouldBeOn ? 1 : 0);
                } 
                else if (type == "analogDevice") {
                    int level = deviceManager.getAnalogDeviceLevel(deviceId);
                    
                    if (payloadData["value"].is<int>()) {
                        int value = payloadData["value"];
                        if (value >= 0 && value <= 2) {
                            level = value;
                            deviceManager.updateLevel(deviceId, level);
                        }
                    }
                    
                    if (shouldBeOn) {
                        int pwmValue = map(level, 0, 2, 0, 255);
                        controlArduinoDevice(pin, 3, pwmValue);
                    } else {
                        controlArduinoDevice(pin, 3, 0);
                    }
                }
            }
        }

        needsRedraw = true;
    } else if (String(topic) == MQTT_TOPIC_PUB_DATA && msgTopic == "sensor_data") {
        int deviceId = payloadData["did"];
        float value = payloadData["value"];
        
        deviceManager.updateFromMQTT(deviceId, (int)value);

        needsRedraw = true;
    }
}

void reconnect() {
    while (!client.connected()) {
        if (client.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASS)) {
            client.subscribe(MQTT_TOPIC_PUB_CONFIG_RESP);
            client.subscribe(MQTT_TOPIC_SUB_CONTROL_REQ);
            client.subscribe(MQTT_TOPIC_PUB_DATA);
            client.publish(MQTT_TOPIC_SUB_CONFIG_REQ, "");
        } else {
            delay(2000);
        }
    }
}

void setup() {
    Serial.begin(115200);

    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }

    client.setBufferSize(2049);
    client.setServer(MQTT_SERVER, MQTT_PORT);
    client.setCallback(callback);

    deviceManager.setChangeCallback(onDeviceChanged);

    touchSpi.begin(XPT2046_CLK, XPT2046_MISO, XPT2046_MOSI, XPT2046_CS);
    touchscreen.begin(touchSpi);
    touchscreen.setRotation(1);

    screen.init();
    screen.setRotation(1);
    screen.invertDisplay(true);
    screen.fillScreen(TFT_WHITE);

    tabBar.draw();
    homeScreen.render();
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    static unsigned long lastPublish = 0;
    if (millis() - lastPublish > 3000) {
        lastPublish = millis();

        std::map<int, bool> dhtPortsRead;
        
        auto tempSensors = deviceManager.getDeviceIdsByType("temperatureSensor");
        for (int id : tempSensors) {
            if (deviceManager.deviceInfoMap.find(id) != deviceManager.deviceInfoMap.end()) {
                auto info = deviceManager.deviceInfoMap[id];
                if (info.port > 0 && dhtPortsRead.find(info.port) == dhtPortsRead.end()) {
                    readArduinoSensor(id, info.port, 5);
                    dhtPortsRead[info.port] = true;
                } else if (info.port == 0) {
                    float randomTemp = random(200, 350) / 10.0;
                    deviceManager.publishSensorData(id, randomTemp);
                }
            }
        }

        auto humSensors = deviceManager.getDeviceIdsByType("humiditySensor");
        for (int id : humSensors) {
            if (deviceManager.deviceInfoMap.find(id) != deviceManager.deviceInfoMap.end()) {
                auto info = deviceManager.deviceInfoMap[id];
                if (info.port > 0 && dhtPortsRead.find(info.port) == dhtPortsRead.end()) {
                    readArduinoSensor(id, info.port, 5);
                    dhtPortsRead[info.port] = true;
                } else if (info.port == 0) {
                    float randomHum = random(400, 900) / 10.0;
                    deviceManager.publishSensorData(id, randomHum);
                }
            }
        }

        auto analogSensors = deviceManager.getDeviceIdsByType("analogSensor");
        for (int id : analogSensors) {
            if (deviceManager.deviceInfoMap.find(id) != deviceManager.deviceInfoMap.end()) {
                auto info = deviceManager.deviceInfoMap[id];
                if (info.port > 0) {
                    readArduinoSensor(id, info.port, 4);
                } else {
                    float value = random(0, 101);
                    deviceManager.publishSensorData(id, value);
                }
            }
        }

        auto digitalSensors = deviceManager.getDeviceIdsByType("digitalSensor");
        for (int id : digitalSensors) {
            if (deviceManager.deviceInfoMap.find(id) != deviceManager.deviceInfoMap.end()) {
                auto info = deviceManager.deviceInfoMap[id];
                if (info.port > 0) {
                    readArduinoSensor(id, info.port, 2);
                }
            }
        }

        needsRedraw = true;
    }

    static unsigned long lastRedraw = 0;
    if (needsRedraw && !touchscreen.touched() && (millis() - lastRedraw > 500)) {
        lastRedraw = millis();
        needsRedraw = false;
        
        if (tabId == 0) {
            homeScreen.render(false);
        } else {
            devicesScreen.render(false);
        }
    }

    if (touchscreen.touched()) {
        TS_Point p = touchscreen.getPoint();
        int tx = map(p.x, 0, 4000, 0, screen.width());
        int ty = map(p.y, 0, 3760, 0, screen.height());

        int newTabId = tabBar.onTouch(tx, ty, false);
        if (newTabId != -1 && tabId != newTabId) {
            tabId = newTabId;
            tabBar.setActive(tabId);
            screen.fillScreen(TFT_WHITE);
            tabBar.draw();
            if (tabId == 0) homeScreen.render();
            else devicesScreen.render();
        }

        else if (tabId == 0) {
            if (homeScreen.handleNavigationTouch(tx, ty)) {
                screen.fillScreen(TFT_WHITE);
                tabBar.draw();
                homeScreen.render();
            } else {
                homeScreen.onTouch(tx, ty);
            }
        }
        else if (tabId == 1) {
            if (devicesScreen.handleNavigationTouch(tx, ty)) {
                screen.fillScreen(TFT_WHITE);
                tabBar.draw();
                devicesScreen.render();
            } else {
                devicesScreen.onTouch(tx, ty);
            }
        }
        
        delay(200);
    }

    delay(50);
}