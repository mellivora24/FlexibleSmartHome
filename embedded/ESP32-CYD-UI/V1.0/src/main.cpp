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

void onDeviceChanged(int deviceId, String type, int value) {
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

void createWidgetFromJson(DynamicJsonDocument doc) {
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
        
        if (item.containsKey("status")) status = item["status"];
        if (item.containsKey("value")) value = item["value"];
        if (item.containsKey("level")) level = item["level"];

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
                Serial.print("Rain sensor detected: ID = ");
                Serial.println(id);
            }
            if (name.indexOf("gio") != -1) {
                windSensorId = id;
                Serial.print("Wind sensor detected: ID = ");
                Serial.println(id);
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

    Serial.print("Received topic: ");
    Serial.println(topic);
    Serial.print("Message: ");
    Serial.println(message);

    DynamicJsonDocument doc(4096);
    DeserializationError error = deserializeJson(doc, message);
    if (error) {
        Serial.print("JSON parse error: ");
        Serial.println(error.c_str());
        return;
    }

    String msgTopic = doc["topic"].as<String>();
    JsonVariant payloadData = doc["payload"];

    if (String(topic) == MQTT_TOPIC_PUB_CONFIG_RESP && msgTopic == "config") {
        JsonArray devices = payloadData.as<JsonArray>();
        DynamicJsonDocument configDoc(4096);
        configDoc["payload"] = devices;
        
        createWidgetFromJson(configDoc);
    } else if (String(topic) == MQTT_TOPIC_SUB_CONTROL_REQ) {
        int deviceId = payloadData["did"];
        String command = payloadData["command"].as<String>();
        bool shouldBeOn = command.equalsIgnoreCase("ON");

        deviceManager.updateFromMQTT(deviceId, shouldBeOn);

        if (payloadData.containsKey("value")) {
            int value = payloadData["value"];
            if (value >= 0 && value <= 2) {
                deviceManager.updateLevel(deviceId, value);
            }
        }

        screen.fillScreen(TFT_WHITE);
        tabBar.draw();
        if (tabId == 0) homeScreen.render();
        else devicesScreen.render();
    } else if (String(topic) == MQTT_TOPIC_PUB_DATA && msgTopic == "sensor_data") {
        int deviceId = payloadData["did"];
        float value = payloadData["value"];
        
        deviceManager.updateFromMQTT(deviceId, (int)value);

        if (deviceId == rainSensorId && value > 50) {
            Serial.write('1');
            Serial.println();
            Serial.println("Alert: Rain sensor > 50! Blink LED1");
        }
        
        if (deviceId == windSensorId && value > 50) {
            Serial.write('2');
            Serial.println();
            Serial.println("Alert: Wind sensor > 50! Blink LED2");
        }

        if (tabId == 0) {
            screen.fillRect(0, 0, screen.width(), screen.height() - 30, TFT_WHITE);
            tabBar.draw();
            homeScreen.render();
        }
    }
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        if (client.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASS)) {
            Serial.println("connected");
            client.subscribe(MQTT_TOPIC_PUB_CONFIG_RESP);
            client.subscribe(MQTT_TOPIC_SUB_CONTROL_REQ);
            client.subscribe(MQTT_TOPIC_PUB_DATA);
            client.publish(MQTT_TOPIC_SUB_CONFIG_REQ, "");
        } else {
            Serial.print("failed, rc=");
            Serial.println(client.state());
            delay(2000);
        }
    }
}

void setup() {
    Serial.begin(115200);

    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");

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
    if (millis() - lastPublish > 5000) {
        lastPublish = millis();

        auto tempSensors = deviceManager.getDeviceIdsByType("temperatureSensor");
        for (int id : tempSensors) {
            float randomTemp = random(200, 350) / 10.0;
            deviceManager.publishSensorData(id, randomTemp);
        }

        auto humSensors = deviceManager.getDeviceIdsByType("humiditySensor");
        for (int id : humSensors) {
            float randomHum = random(400, 900) / 10.0;
            deviceManager.publishSensorData(id, randomHum);
        }

        auto analogSensors = deviceManager.getDeviceIdsByType("analogSensor");
        for (int id : analogSensors) {
            float value = random(0, 101);
            deviceManager.publishSensorData(id, value);
        }

        if (tabId == 0) {
            screen.fillRect(0, 0, screen.width(), screen.height() - 30, TFT_WHITE);
            tabBar.draw();
            homeScreen.render();
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
                homeScreen.render();
            }
        }
        else if (tabId == 1) {
            if (devicesScreen.handleNavigationTouch(tx, ty)) {
                screen.fillScreen(TFT_WHITE);
                tabBar.draw();
                devicesScreen.render();
            } else {
                devicesScreen.onTouch(tx, ty);
                devicesScreen.render();
            }
        }
        
        delay(200);
    }

    delay(50);
}
