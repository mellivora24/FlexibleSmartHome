#pragma once

#include <WString.h>
#include "WidgetCard.h"

class DigitalDevice : public WidgetCard {
private:
    bool state;
    const char* label;
    uint8_t textSize;
    int deviceId;
    void (*onStateChangeCallback)(int);

public:
    DigitalDevice(TFT_eSPI* tft, int x, int y, int w, int h, const char* label, uint8_t textSize, int deviceId = -1)
        : WidgetCard(tft, x, y, w, h, true), state(false), label(label), textSize(textSize), 
          deviceId(deviceId), onStateChangeCallback(nullptr) {}

    void setState(bool s) { 
        state = s; 
        render();
    }

    bool getState() { return state; }
    
    int getDeviceId() { return deviceId; }
    
    void setOnStateChangeCallback(void (*callback)(int)) {
        onStateChangeCallback = callback;
    }

    void render() override {
        tft->fillRect(x, y, w, h, TFT_WHITE);

        tft->drawRoundRect(x, y, w, h, 16, TFT_SILVER);

        tft->setTextDatum(MC_DATUM);
        tft->setTextColor(TFT_BLACK, TFT_WHITE);
        tft->setTextSize(textSize);
        tft->drawString(label, x + w/2, y + 15);

        int cx = x + w / 2;
        int cy = y + h / 2;
        int r  = min(w, h) / 4;

        uint16_t c = state ? TFT_YELLOW : TFT_DARKGREY;
        tft->fillCircle(cx, cy, r, c);

        String stateStr = state ? "ON" : "OFF";
        tft->setTextColor(TFT_BLACK, TFT_WHITE);
        tft->drawString(stateStr, cx, y + h - 20);

        delay(100);
    }

    void onTouch(int tx, int ty) override {
        state = !state;
        
        // Gọi callback nếu có
        if (onStateChangeCallback && deviceId != -1) {
            onStateChangeCallback(deviceId);
        }
    }
};
