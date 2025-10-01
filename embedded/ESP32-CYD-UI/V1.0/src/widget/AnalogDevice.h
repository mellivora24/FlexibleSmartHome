#pragma once
#include "WidgetCard.h"

class AnalogDevice : public WidgetCard {
private:
    int level; // 0 = Low, 1 = Medium, 2 = High
public:
    AnalogDevice(TFT_eSPI* tft, int x, int y, int w, int h)
        : WidgetCard(tft, x, y, w, h, true), level(1) {}

    int getLevel() { return level; }

    void render() override {
        tft->drawRect(x, y, w, h, TFT_WHITE);

        int sliderX = x + w - 20;
        int sliderY = y + 10;
        int sliderH = h - 20;

        tft->drawRect(sliderX, sliderY, 10, sliderH, TFT_LIGHTGREY);
        for (int i = 0; i < 3; i++) {
            int posY = sliderY + i * (sliderH / 3);
            uint16_t c = (i == level) ? TFT_WHITE : TFT_DARKGREY;
            tft->fillRect(sliderX + 1, posY + 1, 8, sliderH / 3 - 2, c);
        }
    }

    void onTouch(int tx, int ty) override {
        if (tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
            int sliderY = y + 10;
            int sliderH = h - 20;
            int section = (ty - sliderY) / (sliderH / 3);
            level = constrain(section, 0, 2);
        }
    }
};
