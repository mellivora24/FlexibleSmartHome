#include "Screen.h"
#include "widget/WidgetCard.h"

Screen::Screen(TFT_eSPI* tft) : screen(tft) {}

void Screen::addWidget(WidgetCard* widget) {
    widgets.push_back(widget);
}

void Screen::onTouch(int tx, int ty) {
    for (auto& w : widgets) {
        if (w->touchable && tx >= w->x && tx <= w->x + w->w && ty >= w->y && ty <= w->y + w->h) {
            w->onTouch(tx, ty);
            w->render();
            return;
        }
    }
}

void Screen::render() {
    for (auto& w : widgets) w->render();
}
