#include "Screen.h"
#include "widget/WidgetCard.h"

Screen::Screen(TFT_eSPI* tft, int itemsPerPage, int tabBarHeight) 
    : screen(tft), currentPage(0), itemsPerPage(itemsPerPage), 
      buttonHeight(40), tabBarHeight(tabBarHeight) {}

void Screen::addWidget(WidgetCard* widget) {
    widgets.push_back(widget);
}

void Screen::onTouch(int tx, int ty) {
    int startIdx = currentPage * itemsPerPage;
    int endIdx = min(startIdx + itemsPerPage, (int)widgets.size());
    
    for (int i = startIdx; i < endIdx; i++) {
        auto w = widgets[i];
        if (w->touchable && tx >= w->x && tx <= w->x + w->w && ty >= w->y && ty <= w->y + w->h) {
            w->onTouch(tx, ty);
            break;
        }
    }
}

void Screen::render() {
    screen->fillRect(0, 0, screen->width(), screen->height() - tabBarHeight - buttonHeight, TFT_WHITE);

    int startIdx = currentPage * itemsPerPage;
    int endIdx = min(startIdx + itemsPerPage, (int)widgets.size());
    
    for (int i = startIdx; i < endIdx; i++) {
        widgets[i]->render();
    }

    drawNavigationButtons();
}

void Screen::clearWidgets() {
    for (auto& w : widgets) delete w;
    widgets.clear();
    currentPage = 0;
}

void Screen::push_back(WidgetCard* widget) {
    widgets.push_back(widget);
}

void Screen::drawNavigationButtons() {
    int totalPages = getTotalPages();
    if (totalPages <= 1) return;

    int screenContentHeight = screen->height() - tabBarHeight;
    int buttonY = (screenContentHeight - buttonHeight) / 2;
    int buttonWidth = 30;
    int margin = 10;
    
    // Left button [<]
    uint16_t leftBgColor = (currentPage > 0) ? TFT_BLUE : TFT_DARKGREY;
    screen->fillRoundRect(margin, buttonY, buttonWidth, buttonHeight, 8, leftBgColor);
    screen->drawRoundRect(margin, buttonY, buttonWidth, buttonHeight, 8, TFT_WHITE);
    screen->setTextColor(TFT_WHITE, leftBgColor);
    screen->setTextDatum(MC_DATUM);
    screen->setTextSize(2);
    screen->drawString("<", margin + buttonWidth/2, buttonY + buttonHeight/2);
    
    // Right button [>]
    int rightButtonX = screen->width() - buttonWidth - margin;
    uint16_t rightBgColor = (currentPage < totalPages - 1) ? TFT_BLUE : TFT_DARKGREY;
    screen->fillRoundRect(rightButtonX, buttonY, buttonWidth, buttonHeight, 8, rightBgColor);
    screen->drawRoundRect(rightButtonX, buttonY, buttonWidth, buttonHeight, 8, TFT_WHITE);
    screen->setTextColor(TFT_WHITE, rightBgColor);
    screen->setTextDatum(MC_DATUM);
    screen->setTextSize(2);
    screen->drawString(">", rightButtonX + buttonWidth/2, buttonY + buttonHeight/2);
}

bool Screen::isTouchOnButton(int tx, int ty, bool isLeftButton) {
    int screenContentHeight = screen->height() - tabBarHeight;
    int buttonY = (screenContentHeight - buttonHeight) / 2;
    int buttonWidth = 30;
    int margin = 10;
    
    if (ty < buttonY || ty > buttonY + buttonHeight) return false;
    
    if (isLeftButton) {
        return (tx >= margin && tx <= margin + buttonWidth);
    } else {
        int rightButtonX = screen->width() - buttonWidth - margin;
        return (tx >= rightButtonX && tx <= rightButtonX + buttonWidth);
    }
}

bool Screen::handleNavigationTouch(int tx, int ty) {
    int totalPages = getTotalPages();
    if (totalPages <= 1) return false;

    if (isTouchOnButton(tx, ty, true) && currentPage > 0) {
        previousPage();
        return true;
    }
    
    if (isTouchOnButton(tx, ty, false) && currentPage < totalPages - 1) {
        nextPage();
        return true;
    }
    
    return false;
}

void Screen::nextPage() {
    int totalPages = getTotalPages();
    if (currentPage < totalPages - 1) {
        currentPage++;
    }
}

void Screen::previousPage() {
    if (currentPage > 0) {
        currentPage--;
    }
}

int Screen::getCurrentPage() {
    return currentPage;
}

int Screen::getTotalPages() {
    if (widgets.empty()) return 1;
    return (widgets.size() + itemsPerPage - 1) / itemsPerPage;
}
