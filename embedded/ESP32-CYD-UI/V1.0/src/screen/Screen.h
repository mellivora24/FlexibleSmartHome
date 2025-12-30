#pragma once

#include <vector>
#include <TFT_eSPI.h>
#include "widget/TabBar.h"
#include "widget/WidgetCard.h"

class Screen {
private:
    TFT_eSPI* screen;
    std::vector<WidgetCard*> widgets;
    int currentPage;
    int itemsPerPage;
    int buttonHeight;
    int tabBarHeight;
    
    void drawNavigationButtons();
    bool isTouchOnButton(int tx, int ty, bool isLeftButton);
    
public:
    Screen(TFT_eSPI* tft, int itemsPerPage = 2, int tabBarHeight = 30);

    void addWidget(WidgetCard* widget);
    void onTouch(int tx, int ty);
    void render();
    void render(bool clearBackground);  // Overload: cho phép render không clear background
    void clearWidgets();
    void push_back(WidgetCard* widget);

    void nextPage();
    void previousPage();
    int getCurrentPage();
    int getTotalPages();
    bool handleNavigationTouch(int tx, int ty);
    bool isWidgetVisible(WidgetCard* widget);
};