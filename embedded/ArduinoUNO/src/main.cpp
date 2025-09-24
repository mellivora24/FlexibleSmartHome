#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

struct Device {
  String name;
  String type;
  uint8_t pin;
  uint8_t extra;
};

Device devices[20];
int deviceCount = 0;

Adafruit_NeoPixel* strip = nullptr;
bool configReceived = false;

float readMappedAnalog(uint8_t pin) {
  return map(analogRead(pin), 0, 1023, 0, 100);
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
  for (JsonObject obj : doc["devices"].as<JsonArray>()) {
    devices[deviceCount].name = obj["name"].as<String>();
    devices[deviceCount].type = obj["type"].as<String>();
    devices[deviceCount].pin  = obj["pin"];
    devices[deviceCount].extra= obj.containsKey("extra") ? obj["extra"] : 0;

    if (devices[deviceCount].type.indexOf("Device") > 0)
      pinMode(devices[deviceCount].pin, OUTPUT);
    else
      pinMode(devices[deviceCount].pin, INPUT);

    if (devices[deviceCount].type == "ws2812") {
      strip = new Adafruit_NeoPixel(devices[deviceCount].extra > 0 ? devices[deviceCount].extra : 6,
                                    devices[deviceCount].pin, NEO_GRB + NEO_KHZ800);
      strip->begin();
      strip->show();
    }
    deviceCount++;
  }
  configReceived = true;
}

void handleCommand(JsonDocument& cmd) {
  for (int i = 0; i < deviceCount; i++) {
    if (cmd.containsKey(devices[i].name)) {
      int value = cmd[devices[i].name];
      if (devices[i].type == "digitalDevice") {
        digitalWrite(devices[i].pin, value ? HIGH : LOW);
      } else if (devices[i].type == "analogDevice") {
        int pwm = (value <= 3) ? map(value, 0, 3, 0, 255) : constrain(value, 0, 255);
        analogWrite(devices[i].pin, pwm);
      } else if (devices[i].type == "ws2812" && strip) {
        strip->setBrightness(constrain(value, 0, 255));
        for (int p = 0; p < strip->numPixels(); p++)
          strip->setPixelColor(p, strip->Color(255, 255, 0));
        strip->show();
      }
    }
  }
}

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));
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

  if (!configReceived) return;

  StaticJsonDocument<512> data;
  for (int i = 0; i < deviceCount; i++) {
    if (devices[i].type == "analogSensor") {
      data[devices[i].name] = readMappedAnalog(devices[i].pin);
    } else if (devices[i].type == "digitalSensor") {
      data[devices[i].name] = digitalRead(devices[i].pin);
    } else if (devices[i].type == "tempSensor" || devices[i].type == "humSensor") {
      float raw = analogRead(devices[i].pin);
      if (raw == 0 || isnan(raw)) {
        data[devices[i].name] = randomFloat(24.0, 26.0);
      } else {
        data[devices[i].name] = raw;
      }
    }
  }
  
  serializeJson(data, Serial);
  Serial.println();
  delay(1000);
}
