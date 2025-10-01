#include "HomeScreen.h"
#include "widget/WidgetCard.h"

HomeScreen::HomeScreen(TFT_eSPI* tft) : screen(tft) {}

void HomeScreen::addWidget(WidgetCard* widget) {
    widgets.push_back(widget);
}

void HomeScreen::onTouch(int tx, int ty) {
    for (auto& w : widgets) {
        if (w->touchable && tx >= w->x && tx <= w->x + w->w && ty >= w->y && ty <= w->y + w->h) {
            w->onTouch(tx, ty);
            break;
        }
    }
}

void HomeScreen::render() {
    screen->fillScreen(TFT_BLACK);
    
    for (auto& w : widgets) {
        w->render();
    }
}
