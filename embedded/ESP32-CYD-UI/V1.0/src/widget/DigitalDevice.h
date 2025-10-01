#pragma once
#include "WidgetCard.h"

class DigitalDevice : public WidgetCard {
private:
    bool state;
public:
    DigitalDevice(TFT_eSPI* tft, int x, int y, int w, int h)
        : WidgetCard(tft, x, y, w, h, true), state(false) {}

    void setState(bool s) { state = s; }
    bool getState() { return state; }

    void render() override {
        tft->drawRect(x, y, w, h, TFT_WHITE);

        int cx = x + w / 2;
        int cy = y + h / 2;
        int r = min(w, h) / 4;

        uint16_t c = state ? TFT_YELLOW : TFT_DARKGREY;
        tft->fillCircle(cx, cy, r, c);
    }

    void onTouch(int tx, int ty) override {
        if (tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
            state = !state;
        }
    }
};
