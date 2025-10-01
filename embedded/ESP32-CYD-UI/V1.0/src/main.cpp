#include <Arduino.h>
#include <SPI.h>
#include <TFT_eSPI.h>
#include <TFT_CONF.h>
#include <XPT2046_Touchscreen.h>

#include "widget/TabBar.h"
#include "screen/HomeScreen.h"
#include "widget/AnalogDevice.h"
#include "widget/AnalogSensor.h"
#include "widget/DigitalDevice.h"
#include "widget/DigitalSensor.h"

TFT_eSPI screen = TFT_eSPI();
SPIClass touchSensor = SPIClass(VSPI);
XPT2046_Touchscreen touchscreen(XPT2046_CS, XPT2046_IRQ);

TabItem tabItems[] = {
    {0, "Home"},
    {1, "Devices"},
};

TabBar tabBar(&screen, tabItems, 2, 0, 30);
HomeScreen homeScreen(&screen);

void setup() {
    Serial.begin(115200);

    touchSensor.begin(XPT2046_CLK, XPT2046_MISO, XPT2046_MOSI, XPT2046_CS);
    touchscreen.begin(touchSensor);
    touchscreen.setRotation(1);

    screen.init();
    screen.setRotation(1);
    screen.invertDisplay(true);
    screen.fillScreen(TFT_WHITE);

    tabBar.draw();
}

void loop() {
    if (touchscreen.touched()) {
        TS_Point p = touchscreen.getPoint();

        int tx = map(p.x, 0, 4000, 0, screen.width());
        int ty = map(p.y, 0, 3760, 0, screen.height());

        Serial.printf("Touch: %d, %d\n", tx, ty);

        tabBar.onTouch(tx, ty);
    }
}
