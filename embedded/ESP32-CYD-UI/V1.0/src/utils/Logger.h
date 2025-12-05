#ifndef LOGGER_H
#define LOGGER_H

#include <Arduino.h>

enum LogLevel {
    LOG_NONE,
    LOG_INFO,
    LOG_ERROR,
    LOG_DEBUG,
    LOG_WARNING,
};

class Logger {
public:
    inline static LogLevel currentLevel = LOG_INFO;
    inline static bool enableColor = true;
    inline static bool enableTimestamp = true;

    inline static const char* COLOR_RESET   = "\033[0m";
    inline static const char* COLOR_DEBUG   = "\033[36m";  // Cyan
    inline static const char* COLOR_INFO    = "\033[32m";  // Green
    inline static const char* COLOR_WARNING = "\033[33m";  // Yellow
    inline static const char* COLOR_ERROR   = "\033[31m";  // Red  

    static void debug(const String& msg) {
        if (currentLevel > LOG_DEBUG) return;
        if (enableTimestamp) Serial.printf("[%.3f] ", millis() / 1000.0);
        if (enableColor) Serial.print(COLOR_DEBUG);
        Serial.print("[DEBUG] ");
        Serial.println(msg);
        if (enableColor) Serial.print(COLOR_RESET);
    }

    static void log(const String& msg) {
        if (currentLevel > LOG_INFO) return;
        if (enableTimestamp) Serial.printf("[%.3f] ", millis() / 1000.0);
        if (enableColor) Serial.print(COLOR_INFO);
        Serial.print("[INFO] ");
        Serial.println(msg);
        if (enableColor) Serial.print(COLOR_RESET);
    }

    static void warning(const String& msg) {
        if (currentLevel > LOG_WARNING) return;
        if (enableTimestamp) Serial.printf("[%.3f] ", millis() / 1000.0);
        if (enableColor) Serial.print(COLOR_WARNING);
        Serial.print("[WARN] ");
        Serial.println(msg);
        if (enableColor) Serial.print(COLOR_RESET);
    }

    static void error(const String& msg) {
        if (currentLevel > LOG_ERROR) return;
        if (enableTimestamp) Serial.printf("[%.3f] ", millis() / 1000.0);
        if (enableColor) Serial.print(COLOR_ERROR);
        Serial.print("[ERROR] ");
        Serial.println(msg);
        if (enableColor) Serial.print(COLOR_RESET);
    }

    static void setLevel(LogLevel level) {
        currentLevel = level;
    }
};

#endif
