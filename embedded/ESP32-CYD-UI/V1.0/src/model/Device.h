#pragma once

#include <WString.h>
#include <ArduinoJson.h>

struct Device {
    String id;
    String name;
    String type;   // "digitalDevice", "analogDevice", "digitalSensor", "analogSensor"
    bool online;

    Device() : id(""), name(""), type(""), online(false) {}
    Device(const String &id_, const String &name_, const String &type_, bool online_)
        : id(id_), name(name_), type(type_), online(online_) {}

    String toJson() const {
        StaticJsonDocument<256> doc;
        doc["id"] = id;
        doc["name"] = name;
        doc["type"] = type;
        doc["online"] = online;

        String out;
        serializeJson(doc, out);
        return out;
    }

    static Device fromJson(const String &json) {
        StaticJsonDocument<256> doc;
        DeserializationError err = deserializeJson(doc, json);
        Device d;

        if (!err) {
            d.id = doc["id"]     | "";
            d.name = doc["name"] | "";
            d.type = doc["type"] | "";
            d.online = doc["online"] | false;
        }
        return d;
    }
};
