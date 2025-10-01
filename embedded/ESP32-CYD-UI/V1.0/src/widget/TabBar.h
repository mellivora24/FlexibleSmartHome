#ifndef TABBAR_H
#define TABBAR_H

#include <Arduino.h>
#include <TFT_eSPI.h>

struct TabItem {
    int id;
    const char* label;
};

class TabBar {
  private:
    TFT_eSPI* tft;
    TabItem* items;

    int activeId;
    int itemCount;
    int tabHeight;

  public:
    TabBar(TFT_eSPI* screen, TabItem* tabItems, int count, int defaultId = 0, int height = 40) {
        tft = screen;
        items = tabItems;
        itemCount = count;
        tabHeight = height;
        activeId = defaultId;
    }

    void setActive(int id) {
        if (id != activeId) {
            activeId = id;
            draw();
        }
    }

    int getActive() {
        return activeId;
    }

    void draw() {
        int w = tft->width() / itemCount;
        int y = tft->height() - tabHeight;

        for (int i = 0; i < itemCount; i++) {
            int x = i * w;
            uint16_t color = (items[i].id == activeId) ? TFT_BLUE : TFT_DARKGREY;

            tft->fillRect(x, y, w, tabHeight, color);
            tft->setTextColor(TFT_WHITE, color);
            tft->setTextDatum(MC_DATUM);
            tft->setTextSize(1);
            tft->drawString(items[i].label, x + w/2, y + tabHeight/2);
        }
    }

    int onTouch(int tx, int ty, bool autoSwitch = true) {
        int y = tft->height() - tabHeight;
        int w = tft->width() / itemCount;
        
        if (ty >= y) {
            int index = tx / w;
            if (index >= 0 && index < itemCount) {
                if (autoSwitch) {
                    setActive(items[index].id);
                }
                return items[index].id;
            }
        }
        return -1;
    }
};

#endif
