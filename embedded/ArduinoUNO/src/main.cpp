#include <ArduinoJson.h>
#include <DHT.h>
#include <OneWire.h>
#include <Adafruit_NeoPixel.h>
#include <DallasTemperature.h>

#define TYPE_ANALOG_SENSOR     1
#define TYPE_DIGITAL_SENSOR    2
#define TYPE_ANALOG_DEVICE     3
#define TYPE_DIGITAL_DEVICE    4

struct Device {
  int64_t id;
  int8_t type;
  uint8_t pin;
  uint8_t extra;
  void* instance;
};

Device devices[10];
int deviceCount = 0;

bool configReceived = false;
Adafruit_NeoPixel* strip = nullptr;

float readMappedAnalog(uint8_t pin) {
  return (analogRead(pin) / 1023.0) * 100.0;
}

float randomFloat(float minVal, float maxVal) {
  long r = random(0, 1000);
  return minVal + (maxVal - minVal) * (r / 1000.0);
}

void requestConfig() {
  StaticJsonDocument<64> req;
  req["request"] = "config";
  serializeJson(req, Serial);
  Serial.println();
}

void parseConfig(JsonDocument& doc) {
  deviceCount = 0;
  if (doc["type"] != "response" || doc["topic"] != "config" || !doc.containsKey("devices")) return;

  JsonArray arr = doc["devices"].as<JsonArray>();
  for (JsonObject obj : arr) {
    if (deviceCount >= 10) break;
    devices[deviceCount].id = obj["id"].as<int64_t>();
    devices[deviceCount].type = obj["type"].as<int8_t>();
    devices[deviceCount].pin = obj["pin"].as<uint8_t>();
    devices[deviceCount].extra = obj["extra"].as<uint8_t>();
    devices[deviceCount].instance = nullptr;

    if (devices[deviceCount].type == TYPE_ANALOG_SENSOR || devices[deviceCount].type == TYPE_DIGITAL_SENSOR) {
      pinMode(devices[deviceCount].pin, INPUT);
    } else if (devices[deviceCount].type == TYPE_DIGITAL_DEVICE) {
      pinMode(devices[deviceCount].pin, OUTPUT);
      digitalWrite(devices[deviceCount].pin, LOW);
    } else if (devices[deviceCount].type == TYPE_ANALOG_DEVICE) {
      pinMode(devices[deviceCount].pin, OUTPUT);    // IN1 - direction
      pinMode(devices[deviceCount].extra, OUTPUT);  // IN2 - speed (PWM)
      digitalWrite(devices[deviceCount].pin, LOW);
      analogWrite(devices[deviceCount].extra, 0);
    }

    deviceCount++;
  }
  configReceived = true;
}

void handleCommand(JsonDocument& cmd) {
  if (cmd["type"] != "request" || cmd["topic"] != "control" || !cmd.containsKey("data")) return;

  JsonObject data = cmd["data"].as<JsonObject>();
  int64_t deviceId = data["id"].as<int64_t>();

  for (int i = 0; i < deviceCount; i++) {
    if (devices[i].id == deviceId) {
      if (devices[i].type == TYPE_DIGITAL_DEVICE) {
        bool status = data["status"];
        digitalWrite(devices[i].pin, status ? HIGH : LOW);
      } else if (devices[i].type == TYPE_ANALOG_DEVICE) {
        bool status = data["status"];
        int value = constrain(data["value"] | 0, 0, 255);
        if (status) {
          digitalWrite(devices[i].pin, HIGH);   // forward
          analogWrite(devices[i].extra, value); // speed
        } else {
          digitalWrite(devices[i].pin, LOW);
          analogWrite(devices[i].extra, 0);
        }
      }
      break;
    }
  }

  StaticJsonDocument<256> resp;
  resp["type"] = "response";
  resp["topic"] = "control";
  resp["data"] = data;
  serializeJson(resp, Serial);
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  requestConfig();
}

void loop() {
  if (!configReceived && Serial.available()) {
    StaticJsonDocument<512> cfg;
    if (!deserializeJson(cfg, Serial)) parseConfig(cfg);
  }

  if (configReceived && Serial.available()) {
    StaticJsonDocument<256> cmd;
    if (!deserializeJson(cmd, Serial)) handleCommand(cmd);
  }

  if (configReceived) {
    StaticJsonDocument<512> data;
    data["type"] = "response";
    data["topic"] = "sensorData";
    JsonArray arr = data.createNestedArray("data");

    for (int i = 0; i < deviceCount; i++) {
      if (devices[i].type == TYPE_ANALOG_SENSOR || devices[i].type == TYPE_DIGITAL_SENSOR) {
        JsonObject obj = arr.createNestedObject();
        obj["id"] = devices[i].id;

        if (devices[i].type == TYPE_DIGITAL_SENSOR) {
          obj["value"] = digitalRead(devices[i].pin);
        } else if (devices[i].type == TYPE_ANALOG_SENSOR) {
          obj["value"] = readMappedAnalog(devices[i].pin);
        }
      }
    }

    serializeJson(data, Serial);
    Serial.println();
  }

  delay(1000);
}
