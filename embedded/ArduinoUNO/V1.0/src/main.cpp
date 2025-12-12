#include <Arduino.h>

String input = "";

// Convert A0..A5 → 14..19
int normalizePin(String p) {
  p.trim();
  if (p.length() == 2 && (p[0] == 'A' || p[0] == 'a')) {
    int n = p.substring(1).toInt();
    if (n >= 0 && n <= 5) return 14 + n;
  }
  return p.toInt();
}

bool parseCommand(const String &s, int &pin, int &mode, int &value, bool &hasValue) {
  if (s.length() < 5) return false;
  if (s[0] != '(' || s[s.length()-1] != ')') return false;

  String body = s.substring(1, s.length()-1);

  String parts[3];
  int idx = 0;

  int start = 0;
  for (int i = 0; i < body.length(); i++) {
    if (body[i] == ',') {
      if (idx > 2) return false;
      parts[idx++] = body.substring(start, i);
      start = i + 1;
    }
  }
  if (start < body.length()) {
    parts[idx++] = body.substring(start);
  }

  if (idx < 2) return false;

  pin = normalizePin(parts[0]);
  mode = parts[1].toInt();

  hasValue = (idx == 3);
  if (hasValue) value = parts[2].toInt();

  return true;
}

void setup() {
  Serial.begin(115200);
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') continue;

    input += c;

    if (c == ')') {
      int pin, mode, value;
      bool hasValue;

      if (!parseCommand(input, pin, mode, value, hasValue)) {
        Serial.println("{\"status\":\"failed\",\"error\":\"invalid_format\"}");
        input = "";
        return;
      }

      // digital pins 2–13, analog pins 14–19
      if (!((pin >= 2 && pin <= 13) || (pin >= 14 && pin <= 19))) {
        Serial.println("{\"status\":\"failed\",\"error\":\"invalid_pin\"}");
        input = "";
        return;
      }

      // Mode xử lý
      if (mode == 1) {  // Digital output
        if (!hasValue) {
          Serial.println("{\"status\":\"failed\",\"error\":\"missing_value\"}");
        } else {
          pinMode(pin, OUTPUT);
          digitalWrite(pin, value ? HIGH : LOW);
          Serial.println("{\"status\":\"success\"}");
        }
      }

      else if (mode == 2) { // Digital input
        pinMode(pin, INPUT);
        int v = digitalRead(pin);
        Serial.print("{\"status\":\"success\",\"value\":");
        Serial.print(v);
        Serial.println("}");
      }

      else if (mode == 3) { // PWM output
        if (!hasValue) {
          Serial.println("{\"status\":\"failed\",\"error\":\"missing_value\"}");
        } else {
          pinMode(pin, OUTPUT);
          analogWrite(pin, constrain(value, 0, 255));
          Serial.println("{\"status\":\"success\"}");
        }
      }

      else if (mode == 4) { // Analog input A0–A5
        int raw = analogRead(pin);
        Serial.print("{\"status\":\"success\",\"value\":");
        Serial.print(raw);
        Serial.println("}");
      }

      else {
        Serial.println("{\"status\":\"failed\",\"error\":\"invalid_mode\"}");
      }

      input = "";
    }
  }
}
