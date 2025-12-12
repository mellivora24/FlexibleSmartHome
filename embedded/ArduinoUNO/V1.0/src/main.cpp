#include <Arduino.h>
#include <DHT.h>

String buffer = "";
bool reading = false;

void sendSuccess() { Serial.println("{\"success\":true}"); }
void sendFail(const char* msg) {
    Serial.print("{\"success\":false,\"error\":\"");
    Serial.print(msg);
    Serial.println("\"}");
}
void sendValue(int v) {
    Serial.print("{\"success\":true,\"data\":{\"value\":");
    Serial.print(v);
    Serial.println("}}");
}
void sendDHT(float t, float h) {
    Serial.print("{\"success\":true,\"data\":{\"temperature\":");
    Serial.print(t);
    Serial.print(",\"humidity\":");
    Serial.print(h);
    Serial.println("}}");
}

void processCommand(int pin, int mode, int value, bool hasValue) {

    switch(mode) {

        case 1: {   // digital output
            if (!hasValue) return sendFail("missing_value");

            pinMode(pin, OUTPUT);
            digitalWrite(pin, value ? HIGH : LOW);
            sendSuccess();
            break;
        }

        case 2: {   // digital input
            pinMode(pin, INPUT);
            int v = digitalRead(pin);
            sendValue(v);
            break;
        }

        case 3: {   // PWM output
            if (!hasValue) return sendFail("missing_value");

            pinMode(pin, OUTPUT);
            analogWrite(pin, value);
            sendSuccess();
            break;
        }

        case 4: {   // analog input
            int v = analogRead(pin);
            sendValue(v);
            break;
        }

        case 5: {   // DHT11: return temp + humidity
            DHT dht(pin, DHT11);
            dht.begin();
            delay(100);

            float t = dht.readTemperature();
            float h = dht.readHumidity();

            if (isnan(t) || isnan(h)) {
                sendFail("read_failed");
            } else {
                sendDHT(t, h);
            }
            break;
        }

        default:
            sendFail("invalid_mode");
            break;
    }
}

void parseCommand(String cmd) {
    cmd.trim();
    if (cmd.length() < 4) return;

    cmd.remove(0, 1);
    cmd.remove(cmd.length() - 1, 1);

    int parts[3] = {0, 0, 0};
    int idx = 0;

    char temp[32];
    cmd.toCharArray(temp, sizeof(temp));

    char* token = strtok(temp, ",");
    while (token && idx < 3) {
        parts[idx++] = atoi(token);
        token = strtok(NULL, ",");
    }

    int pin   = parts[0];
    int mode  = parts[1];
    int value = parts[2];
    bool hasValue = (idx == 3);

    if (pin < 2 || pin > 13) {
        sendFail("invalid_pin");
        return;
    }

    processCommand(pin, mode, value, hasValue);
}

void setup() {
    Serial.begin(115200);
}

void loop() {
    while (Serial.available()) {
        char c = Serial.read();

        if (c == '(') {
            buffer = "";
            reading = true;
        }

        if (reading) buffer += c;

        if (c == ')') {
            reading = false;
            parseCommand(buffer);
            buffer = "";
        }
    }
}
