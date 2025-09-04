#include <SPI.h>
#include <TFT_eSPI.h>
#include <TFT_eSPI_Config.h>
#include <XPT2046_Touchscreen.h>

TFT_eSPI tft = TFT_eSPI();
SPIClass touchscreenSPI = SPIClass(VSPI);
XPT2046_Touchscreen touchscreen(XPT2046_CS, XPT2046_IRQ);

TFT_eSPI_Button btn1;
bool btnState = false;

void drawButton(bool pressed) {
  if (pressed) {
    btn1.initButton(&tft, SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 
                    120, 60, TFT_WHITE, TFT_GREEN, TFT_BLACK, 
                    (char*)"ON", 2);
  } else {
    btn1.initButton(&tft, SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 
                    120, 60, TFT_WHITE, TFT_RED, TFT_WHITE, 
                    (char*)"OFF", 2);
  }
  btn1.drawButton(false);
}

void setup() {
  Serial.begin(115200);

  // Init Touchscreen
  touchscreenSPI.begin(XPT2046_CLK, XPT2046_MISO, XPT2046_MOSI, XPT2046_CS);
  touchscreen.begin(touchscreenSPI);
  touchscreen.setRotation(1);

  // Init TFT
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_DARKGREY);

  // Draw default button
  drawButton(btnState);
}

void loop() {
  if (touchscreen.tirqTouched() && touchscreen.touched()) {
    TS_Point p = touchscreen.getPoint();
    // Map tọa độ cảm ứng
    int x = map(p.x, 200, 3700, 1, SCREEN_WIDTH);
    int y = map(p.y, 240, 3800, 1, SCREEN_HEIGHT);

    // Kiểm tra có chạm nút không
    if (btn1.contains(x, y)) {
      btnState = !btnState;
      drawButton(btnState);
      Serial.printf("Button pressed, state = %s\n", btnState ? "ON" : "OFF");
      delay(100);
    }
  }
}
