#pragma once
#include <TFT_eSPI.h>

class WidgetCard {
protected:
    TFT_eSPI* tft;
    int x, y, w, h;
    bool touchable;

public:
    WidgetCard(TFT_eSPI* tft, int x, int y, int w, int h, bool touchable = false)
        : tft(tft), x(x), y(y), w(w), h(h), touchable(touchable) {}

    virtual void render() = 0;
    virtual void renderAt(int ox, int oy) {
        int oldX = x, oldY = y;
        x = ox; y = oy;
        render();
        x = oldX; y = oldY;
    }
    
    virtual void onScreenCleared() {}

    virtual void onTouch(int tx, int ty) {}
    
    virtual ~WidgetCard() {}

    friend class Screen;
};
