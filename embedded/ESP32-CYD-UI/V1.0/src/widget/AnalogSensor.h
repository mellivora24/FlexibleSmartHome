#pragma once
#include "WidgetCard.h"

class AnalogSensor : public WidgetCard {
private:
    int value;
    String label;
    int fontSize = 1;

public:
    AnalogSensor(TFT_eSPI* tft, int x, int y, int w, int h, String name = "Sensor", int fontSize = 1)
        : WidgetCard(tft, x, y, w, h, false), value(0), label(name), fontSize(fontSize) {}

    void setValue(int v) { value = constrain(v, 0, 100); }

    void setLabel(String name) { label = name; }

    void setFontSize(int size) { fontSize = size; }

    void render() override {
        tft->fillRoundRect(x, y, w, h, 8, TFT_WHITE);
        tft->drawRoundRect(x, y, w, h, 8, TFT_SILVER);

        int radius = min(w, h) / 3;
        int centerX = x + w / 2;
        int centerY = y + h / 2;

        uint16_t color = tft->color565(value * 2.55, 255 - value * 2.55, 0);
        int angle = map(value, 0, 100, 0, 360);
        tft->drawArc(centerX, centerY - 5, radius, radius - 5, -180, angle, color, TFT_WHITE);

        String valStr = String(value) + "%";
        tft->setTextDatum(MC_DATUM);
        tft->setTextColor(TFT_BLACK, TFT_WHITE);
        tft->setTextSize(fontSize);
        tft->drawString(valStr, centerX, centerY - 3);

        tft->setTextDatum(BC_DATUM);
        tft->setTextColor(TFT_BLACK, TFT_WHITE);
        tft->setTextSize(1);
        tft->drawString(label, centerX, y + h - 5);
    }
};
