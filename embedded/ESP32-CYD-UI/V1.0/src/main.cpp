#include <Arduino.h>
#include <SPI.h>
#include <TFT_eSPI.h>
#include <TFT_CONF.h>
#include <XPT2046_Touchscreen.h>

#include "widget/TabBar.h"
#include "screen/Screen.h"
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
Screen homeScreen(&screen), devicesScreen(&screen);

DigitalSensor *gasSensor;
AnalogSensor *humiditySensor, *temperatureSensor;

DigitalDevice *light;
AnalogDevice *fan1, *fan2;

int tabId = 0;

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

    gasSensor = new DigitalSensor(&screen, 10, 10, 150, 190, "Gas Sensor", 2);
    humiditySensor = new AnalogSensor(&screen, 170, 10, 140, 90, "Humidity", 1);
    temperatureSensor = new AnalogSensor(&screen, 170, 110, 140, 90, "Temperature", 1);

    gasSensor->setStatus(true);
    humiditySensor->setValue(65);
    temperatureSensor->setValue(28);

    fan1 = new AnalogDevice(&screen, 10, 10, 150, 90, "Fan 1", 1);
    fan2 = new AnalogDevice(&screen, 10, 110, 150, 90, "Fan 2", 1);
    light = new DigitalDevice(&screen, 170, 10, 140, 190, "Light", 2);

    homeScreen.addWidget(gasSensor);
    homeScreen.addWidget(humiditySensor);
    homeScreen.addWidget(temperatureSensor);

    devicesScreen.addWidget(light);
    devicesScreen.addWidget(fan1);
    devicesScreen.addWidget(fan2);

    homeScreen.render();
}

void loop() {
    if (touchscreen.touched()) {
        TS_Point p = touchscreen.getPoint();

        int tx = map(p.x, 0, 4000, 0, screen.width());
        int ty = map(p.y, 0, 3760, 0, screen.height());

        int newTabId = tabBar.onTouch(tx, ty);

        if (tabId != newTabId && newTabId != -1) {
            tabId = newTabId;
            screen.fillScreen(TFT_WHITE);
            tabBar.draw();

            if (tabId == 0) {
                homeScreen.render();
            } else if (tabId == 1) {
                devicesScreen.render();
            }
        }

        if (tabId == 1) {
            devicesScreen.onTouch(tx, ty);
            devicesScreen.render();
        }
    }
}
