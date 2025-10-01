#pragma once
#include <ArduinoJson.h>
#include <string>

enum class UART_Topic {
    CONFIG,
    CONTROL,
    SENSOR_DATA,
    UNKNOWN
};

enum class UART_Type {
    REQUEST,
    RESPONSE,
    UNKNOWN
};

struct UART_DataPackage {
    UART_Type type;
    UART_Topic topic;
    std::string payload;

    UART_DataPackage() : type(UART_Type::UNKNOWN), topic(UART_Topic::UNKNOWN), payload("") {}
    UART_DataPackage(UART_Type t, UART_Topic tp, const std::string &pl)
        : type(t), topic(tp), payload(pl) {}

    static const char* typeToString(UART_Type t) {
        switch (t) {
            case UART_Type::REQUEST: return "request";
            case UART_Type::RESPONSE: return "response";
            default: return "unknown";
        }
    }

    static const char* topicToString(UART_Topic tp) {
        switch (tp) {
            case UART_Topic::CONFIG: return "config";
            case UART_Topic::CONTROL: return "control";
            case UART_Topic::SENSOR_DATA: return "sensorData";
            default: return "unknown";
        }
    }

    static UART_Type parseType(const char* s) {
        if (strcmp(s, "request") == 0) return UART_Type::REQUEST;
        if (strcmp(s, "response") == 0) return UART_Type::RESPONSE;
        return UART_Type::UNKNOWN;
    }

    static UART_Topic parseTopic(const char* s) {
        if (strcmp(s, "config") == 0) return UART_Topic::CONFIG;
        if (strcmp(s, "control") == 0) return UART_Topic::CONTROL;
        if (strcmp(s, "sensorData") == 0) return UART_Topic::SENSOR_DATA;
        return UART_Topic::UNKNOWN;
    }

    std::string toJson() const {
        StaticJsonDocument<512> doc;
        doc["type"] = typeToString(type);
        doc["topic"] = topicToString(topic);
        doc["payload"] = payload;
        std::string out;
        serializeJson(doc, out);
        return out;
    }

    static UART_DataPackage fromJson(const std::string &json) {
        StaticJsonDocument<512> doc;
        deserializeJson(doc, json);

        UART_DataPackage pkg;
        pkg.type = parseType(doc["type"] | "unknown");
        pkg.topic = parseTopic(doc["topic"] | "unknown");
        pkg.payload = doc["payload"] | "";

        return pkg;
    }

    static UART_DataPackage makeConfigRequest() {
        return UART_DataPackage(UART_Type::REQUEST, UART_Topic::CONFIG, "");
    }

    static UART_DataPackage makeConfigResponse(const std::string &devicesJson) {
        return UART_DataPackage(UART_Type::RESPONSE, UART_Topic::CONFIG, devicesJson);
    }

    static UART_DataPackage makeControlRequest(const std::string &controlJson) {
        return UART_DataPackage(UART_Type::REQUEST, UART_Topic::CONTROL, controlJson);
    }

    static UART_DataPackage makeControlResponse(const std::string &controlJson) {
        return UART_DataPackage(UART_Type::RESPONSE, UART_Topic::CONTROL, controlJson);
    }

    static UART_DataPackage makeSensorDataResponse(const std::string &sensorArrayJson) {
        return UART_DataPackage(UART_Type::RESPONSE, UART_Topic::SENSOR_DATA, sensorArrayJson);
    }
};
