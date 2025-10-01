#pragma once

#include <WString.h>
#include <ArduinoJson.h>

struct MQTT_DataPackage {
    String uid;
    String topic;
    String payload;

    MQTT_DataPackage() : uid(""), topic(""), payload("") {}
    MQTT_DataPackage(const String &uid_, const String &topic_, const String &payload_)
        : uid(uid_), topic(topic_), payload(payload_) {}

    String toJson() const {
        StaticJsonDocument<512> doc;
        doc["uid"]     = uid;
        doc["topic"]   = topic;
        doc["payload"] = payload;

        String out;
        serializeJson(doc, out);
        return out;
    }

    static MQTT_DataPackage fromJson(const String &json) {
        StaticJsonDocument<512> doc;
        DeserializationError err = deserializeJson(doc, json);
        MQTT_DataPackage pkg;
        if (!err) {
            pkg.uid     = doc["uid"]     | "";
            pkg.topic   = doc["topic"]   | "";
            pkg.payload = doc["payload"] | "";
        }
        return pkg;
    }
};
