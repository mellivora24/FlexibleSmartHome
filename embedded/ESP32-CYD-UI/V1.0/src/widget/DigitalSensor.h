#pragma once
#include "WidgetCard.h"

class DigitalSensor : public WidgetCard {
private:
    bool value;
    String label;
    int textSize;

public:
    DigitalSensor(TFT_eSPI* tft, int x, int y, int w, int h, String name = "Sensor", int textSize = 1)
        : WidgetCard(tft, x, y, w, h, false), value(false), label(name), textSize(textSize) {}

    void setStatus(bool s) { value = s; }

    void render() override {
        tft->fillRoundRect(x, y, w, h, 8, TFT_WHITE);
        tft->drawRoundRect(x, y, w, h, 8, TFT_SILVER);

        int cx = x + w / 2;
        int cy = y + h / 2;
        int r = min(w, h) / 4;

        uint16_t c = value ? TFT_GREEN : TFT_RED;
        tft->fillCircle(cx, cy, r, c);

        tft->setTextDatum(BC_DATUM);
        tft->setTextColor(TFT_BLACK, TFT_WHITE);
        tft->setTextSize(textSize);
        tft->drawString(label, cx, y + h - 5);
    }
};
