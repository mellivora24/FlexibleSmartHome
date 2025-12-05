#include <Arduino.h>

#define LED1_PIN 4
#define LED2_PIN 5

unsigned long blinkStartTime = 0;
int blinkMode = 0; // 0: không nháy, 1: LED1, 2: LED2
bool blinkState = false;
unsigned long lastBlinkToggle = 0;

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
