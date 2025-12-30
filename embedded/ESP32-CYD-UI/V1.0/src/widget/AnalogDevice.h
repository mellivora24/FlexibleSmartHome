#pragma once
#include "WidgetCard.h"

class AnalogDevice : public WidgetCard {
private:
    uint8_t level; // 0 = Low, 1 = Medium, 2 = High
    const char* label;
    uint8_t textSize;
    bool isOn;
    int deviceId;
    void (*onStateChangeCallback)(int);
    
    uint16_t getLevelColor(uint8_t lvl) {
        switch(lvl) {
            case 0: return tft->color565(100, 149, 237); // Cornflower blue - Low
            case 1: return tft->color565(255, 165, 0);   // Orange - Medium
            case 2: return tft->color565(255, 69, 58);   // Red - High
            default: return TFT_DARKGREY;
        }
    }

public:
    AnalogDevice(TFT_eSPI* tft, int x, int y, int w, int h, const char* label, uint8_t textSize, int deviceId = -1)
        : WidgetCard(tft, x, y, w, h, true), 
          level(0), label(label), textSize(textSize), isOn(false), 
          deviceId(deviceId), onStateChangeCallback(nullptr) {}

    int getLevel() { return level; }
    bool getStatus() { return isOn; }
    int getDeviceId() { return deviceId; }
    
    void setLevel(uint8_t newLevel) {
        level = constrain(newLevel, 0, 2);
    }
    
    void setStatus(bool status) {
        isOn = status;
    }
    
    void toggle() {
        isOn = !isOn;
    }
    
    void setOnStateChangeCallback(void (*callback)(int)) {
        onStateChangeCallback = callback;
    }

    void render() override {
        uint16_t bgColor = isOn ? tft->color565(30, 30, 35) : tft->color565(20, 20, 25);
        uint16_t borderColor = isOn ? tft->color565(60, 60, 70) : tft->color565(40, 40, 50);
        
        tft->fillRoundRect(x, y, w, h, 8, bgColor);
        tft->drawRoundRect(x, y, w, h, 8, borderColor);

        uint16_t labelColor = isOn ? TFT_WHITE : tft->color565(100, 100, 110);
        tft->setTextColor(labelColor);
        tft->setTextSize(textSize);
        tft->setTextDatum(TL_DATUM);
        tft->drawString(label, x + 10, y + 10);
        
        tft->setTextSize(1);
        tft->setTextColor(isOn ? TFT_GREEN : TFT_RED);
        tft->setTextDatum(TR_DATUM);
        tft->drawString(isOn ? "ON" : "OFF", x + w - 10, y + 12);

        if (isOn) {
            const char* levelText[] = {"LOW", "MED", "HIGH"};
            tft->setTextSize(textSize);
            tft->setTextColor(getLevelColor(level));
            tft->setTextDatum(TC_DATUM);
            tft->drawString(levelText[level], x + w/2, y + 35);
        }
        
        int buttonW = (w - 40) / 3;
        int buttonH = 30;
        int buttonY = y + h - buttonH - 10;
        int spacing = 5;
        
        for (int i = 0; i < 3; i++) {
            int buttonX = x + 10 + i * (buttonW + spacing);

            uint16_t bgBtnColor, borderBtnColor, textBtnColor;
            
            if (!isOn) {
                bgBtnColor = tft->color565(40, 40, 50);
                borderBtnColor = tft->color565(50, 50, 60);
                textBtnColor = tft->color565(80, 80, 90);
            } else if (i == level) {
                bgBtnColor = getLevelColor(i);
                borderBtnColor = TFT_WHITE;
                textBtnColor = TFT_WHITE;
            } else {
                bgBtnColor = tft->color565(50, 50, 60);
                borderBtnColor = tft->color565(70, 70, 80);
                textBtnColor = tft->color565(150, 150, 160);
            }

            tft->fillRoundRect(buttonX, buttonY, buttonW, buttonH, 6, bgBtnColor);
            tft->drawRoundRect(buttonX, buttonY, buttonW, buttonH, 6, borderBtnColor);
            
            tft->setTextColor(textBtnColor);
            tft->setTextSize(2);
            tft->setTextDatum(MC_DATUM);
            tft->drawString(String(i + 1), buttonX + buttonW/2, buttonY + buttonH/2);
        }
    }

    void onTouch(int tx, int ty) override {
        if (tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
            int buttonW = (w - 40) / 3;
            int buttonH = 30;
            int buttonY = y + h - buttonH - 10;
            int spacing = 5;
            
            bool touchedButton = false;

            if (isOn) {
                for (int i = 0; i < 3; i++) {
                    int buttonX = x + 10 + i * (buttonW + spacing);
                    
                    if (tx >= buttonX && tx <= buttonX + buttonW && 
                        ty >= buttonY && ty <= buttonY + buttonH) {
                        setLevel(i);
                        render();  // Render ngay để thấy feedback
                        touchedButton = true;
                        
                        // Gọi callback khi thay đổi level
                        if (onStateChangeCallback && deviceId != -1) {
                            onStateChangeCallback(deviceId);
                        }
                        break;
                    }
                }
            }

            if (!touchedButton) {
                toggle();
                render();  // Render ngay để thấy feedback
                
                // Gọi callback khi toggle ON/OFF
                if (onStateChangeCallback && deviceId != -1) {
                    onStateChangeCallback(deviceId);
                }
            }
        }
        delay(100);
    }
};
