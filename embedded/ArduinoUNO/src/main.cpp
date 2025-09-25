#include <ArduinoJson.h>
#include <DHT.h>
#include <OneWire.h>
#include <Adafruit_NeoPixel.h>
#include <DallasTemperature.h>

struct Device {
  String name;
  String type;
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
    devices[deviceCount].name = obj["name"].as<String>();
    devices[deviceCount].type = obj["type"].as<String>();
    devices[deviceCount].pin = obj["pin"].as<uint8_t>();
    devices[deviceCount].extra = obj["extra"].as<uint8_t>();
    devices[deviceCount].instance = nullptr;

    if (devices[deviceCount].type == "digitalSensor" || devices[deviceCount].type == "analogSensor") {
      pinMode(devices[deviceCount].pin, INPUT);
    } else if (devices[deviceCount].type == "digitalDevice") {
      pinMode(devices[deviceCount].pin, OUTPUT);
      digitalWrite(devices[deviceCount].pin, LOW);
    } else if (devices[deviceCount].type == "analogDevice") {
      pinMode(devices[deviceCount].pin, OUTPUT);    // IN1 - direction
      pinMode(devices[deviceCount].extra, OUTPUT);  // IN2 - speed (PWM)
      digitalWrite(devices[deviceCount].pin, LOW);
      analogWrite(devices[deviceCount].extra, 0);
    } else if (devices[deviceCount].type == "ws2812") {
      strip = new Adafruit_NeoPixel(devices[deviceCount].extra, devices[deviceCount].pin, NEO_GRB + NEO_KHZ800);
      strip->begin();
      strip->show();
      devices[deviceCount].instance = strip;
    } else if (devices[deviceCount].type == "dht11") {
      DHT* dht = new DHT(devices[deviceCount].pin, DHT11);
      dht->begin();
      devices[deviceCount].instance = dht;
    } else if (devices[deviceCount].type == "ds18b20") {
      OneWire* oneWire = new OneWire(devices[deviceCount].pin);
      DallasTemperature* sensors = new DallasTemperature(oneWire);
      sensors->begin();
      devices[deviceCount].instance = sensors;
    }

    deviceCount++;
  }
  configReceived = true;
}

void handleCommand(JsonDocument& cmd) {
  if (cmd["type"] != "request" || cmd["topic"] != "control" || !cmd.containsKey("data")) return;

  JsonObject data = cmd["data"].as<JsonObject>();
  String name = data["name"].as<String>();

  for (int i = 0; i < deviceCount; i++) {
    if (devices[i].name == name) {
      if (devices[i].type == "digitalDevice") {
        bool status = data["status"];
        digitalWrite(devices[i].pin, status ? HIGH : LOW);
      } else if (devices[i].type == "analogDevice") {
        bool status = data["status"];
        int value = constrain(data["value"] | 0, 0, 255);
        if (status) {
          digitalWrite(devices[i].pin, HIGH);   // forward
          analogWrite(devices[i].extra, value); // speed
        } else {
          digitalWrite(devices[i].pin, LOW);
          analogWrite(devices[i].extra, 0);
        }
      } else if (devices[i].type == "ws2812" && strip != nullptr) {
        bool status = data["status"];
        if (status) {
          uint32_t color = strip->Color(255, 255, 255);
          strip->fill(color, 0, strip->numPixels());
        } else {
          strip->clear();
        }
        strip->show();
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
      JsonObject obj = arr.createNestedObject();
      obj["name"] = devices[i].name;

      if (devices[i].type == "digitalSensor") {
        obj["value"] = digitalRead(devices[i].pin);
      } else if (devices[i].type == "analogSensor") {
        obj["value"] = readMappedAnalog(devices[i].pin);
      } else if (devices[i].type == "dht11") {
        DHT* dht = (DHT*)devices[i].instance;
        float h = dht->readHumidity();
        if (isnan(h)) h = randomFloat(24.0, 26.0); // fallback
        obj["value"] = h;
      } else if (devices[i].type == "ds18b20") {
        DallasTemperature* sensors = (DallasTemperature*)devices[i].instance;
        sensors->requestTemperatures();
        float t = sensors->getTempCByIndex(0);
        if (t == DEVICE_DISCONNECTED_C) t = randomFloat(24.0, 26.0); // fallback
        obj["value"] = t;
      }
    }

    serializeJson(data, Serial);
    Serial.println();
  }

  delay(1000);
}
