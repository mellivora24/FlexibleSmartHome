#pragma once

#include <vector>
#include <TFT_eSPI.h>
#include "widget/TabBar.h"

class WidgetCard;

class Screen {
private:
    TFT_eSPI* screen;
    std::vector<WidgetCard*> widgets;

public:
    Screen(TFT_eSPI* tft);

    void addWidget(WidgetCard* widget);
    void onTouch(int tx, int ty);
    void render();
};
