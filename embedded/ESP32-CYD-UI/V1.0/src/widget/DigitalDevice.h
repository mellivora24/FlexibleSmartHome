#pragma once

#include <WString.h>
#include "WidgetCard.h"

class DigitalDevice : public WidgetCard {
private:
    bool state;
    bool previousState;
    String label;
    uint8_t textSize;
    int deviceId;
    void (*onStateChangeCallback)(int);
    bool needsFullRedraw;

public:
    DigitalDevice(TFT_eSPI* tft, int x, int y, int w, int h, const char* label, uint8_t textSize, int deviceId = -1)
        : WidgetCard(tft, x, y, w, h, true), state(false), previousState(false), label(label), 
          textSize(textSize), deviceId(deviceId), onStateChangeCallback(nullptr), needsFullRedraw(true) {}

    void setState(bool s, bool shouldRender = true) { 
        state = s;
        if (shouldRender) {
            render();
        }
    }

    bool getState() { return state; }
    
    int getDeviceId() { return deviceId; }
    
    void setOnStateChangeCallback(void (*callback)(int)) {
        onStateChangeCallback = callback;
    }
    
    void onScreenCleared() override {
        needsFullRedraw = true;
        previousState = !state;
    }

    void render() override {
        if (needsFullRedraw) {
            tft->fillRect(x, y, w, h, TFT_WHITE);
            tft->drawRoundRect(x, y, w, h, 16, TFT_SILVER);
            
            tft->setTextDatum(MC_DATUM);
            tft->setTextColor(TFT_BLACK, TFT_WHITE);
            tft->setTextSize(textSize);
            tft->drawString(label, x + w/2, y + 15);
            
            needsFullRedraw = false;
            previousState = !state;
        }

        int cx = x + w / 2;
        int cy = y + h / 2;
        int r  = min(w, h) / 4;

        if (state != previousState) {
            uint16_t c = state ? TFT_YELLOW : TFT_DARKGREY;
            tft->fillCircle(cx, cy, r, c);

            int textWidth = 40;
            int textHeight = 16;
            tft->fillRect(cx - textWidth/2, y + h - 30, textWidth, textHeight, TFT_WHITE);
            
            String stateStr = state ? "ON" : "OFF";
            tft->setTextDatum(MC_DATUM);
            tft->setTextColor(TFT_BLACK, TFT_WHITE);
            tft->setTextSize(textSize);
            tft->drawString(stateStr, cx, y + h - 20);

            previousState = state;
        }
    }

    void onTouch(int tx, int ty) override {
        state = !state;
        
        // Render ngay để user thấy feedback
        render();
        
        // Gọi callback nếu có
        if (onStateChangeCallback && deviceId != -1) {
            onStateChangeCallback(deviceId);
        }
    }
};
