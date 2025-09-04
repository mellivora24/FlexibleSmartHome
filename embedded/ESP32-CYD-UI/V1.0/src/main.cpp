#include <SPI.h>
#include <WiFi.h>
#include <TFT_eSPI.h>
#include <WiFI_Config.h>
#include <MQTT_Config.h>
#include <PubSubClient.h>
#include <TFT_eSPI_Config.h>
#include <XPT2046_Touchscreen.h>


TFT_eSPI tft = TFT_eSPI();
SPIClass touchscreenSPI = SPIClass(VSPI);
XPT2046_Touchscreen touchscreen(XPT2046_CS, XPT2046_IRQ);

// ===================== WiFi + MQTT =====================
WiFiClient espClient;
PubSubClient client(espClient);

// ===================== APP STATE =====================
bool ledState = false;
int sliderValue = 50; // 0-100%

// ===================== UTILS =====================
void drawWidgets() {
  tft.fillScreen(TFT_WHITE);

  // LED widget
  tft.setTextColor(TFT_BLACK, TFT_WHITE);
  tft.drawString("LED", 30, 40, 2);
  tft.fillRect(20, 70, 60, 60, ledState ? TFT_YELLOW : TFT_WHITE);
  tft.drawRect(20, 70, 60, 60, TFT_BLACK);

  // Slider widget
  tft.drawString("SLIDER", 150, 40, 2);
  tft.drawRect(100, 100, 200, 30, TFT_BLACK);
  int sliderPos = map(sliderValue, 0, 100, 100, 300);
  tft.fillRect(100, 100, sliderPos - 100, 30, TFT_BLUE);
}

void drawConnectionStatus() {
  if (WiFi.status() != WL_CONNECTED) {
    tft.setTextColor(TFT_RED, TFT_WHITE);
    tft.drawString("WiFi disconnected", SCREEN_WIDTH - 140, SCREEN_HEIGHT - 30, 2);
  } else if (!client.connected()) {
    tft.setTextColor(TFT_RED, TFT_WHITE);
    tft.drawString("MQTT disconnected", SCREEN_WIDTH - 150, SCREEN_HEIGHT - 30, 2);
  }
}

// ===================== MQTT CALLBACK =====================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  String message = String((char*)payload);

  if (String(topic) == TOPIC_LED) {
    if (message == "on") ledState = true;
    else if (message == "off") ledState = false;
    drawWidgets();
  }
}

// ===================== CONNECTION =====================
void reconnectMQTT() {
  while (!client.connected()) {
    if (client.connect("ESP32Client", MQTT_USER, MQTT_PASS)) {
      client.subscribe(TOPIC_LED);
    } else {
      delay(2000);
    }
  }
}

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

// ===================== TOUCH HANDLER =====================
void handleTouch() {
  if (touchscreen.tirqTouched() && touchscreen.touched()) {
    TS_Point p = touchscreen.getPoint();
    int x = map(p.x, 200, 3700, 1, SCREEN_WIDTH);
    int y = map(p.y, 240, 3800, 1, SCREEN_HEIGHT);

    // Check slider area
    if (y > 100 && y < 130 && x > 100 && x < 300) {
      sliderValue = map(x, 100, 300, 0, 100);
      client.publish(TOPIC_SLIDER, String(sliderValue).c_str());
      drawWidgets();
    }
  }
}

// ===================== SETUP =====================
void setup() {
  Serial.begin(115200);

  // TFT + TOUCH
  touchscreenSPI.begin(XPT2046_CLK, XPT2046_MISO, XPT2046_MOSI, XPT2046_CS);
  touchscreen.begin(touchscreenSPI);
  touchscreen.setRotation(1);
  tft.init();
  tft.setRotation(1);

  // WiFi + MQTT
  connectWiFi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(mqttCallback);

  drawWidgets();
}

// ===================== LOOP =====================
void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  if (!client.connected()) reconnectMQTT();
  client.loop();

  handleTouch();
  drawConnectionStatus();
}
