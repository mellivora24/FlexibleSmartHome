#pragma once

#include <WString.h>
#include <ArduinoJson.h>

#include "Sensor.h"

struct SensorData {
    int64_t id;
    int64_t uid;
    int64_t sid;
    double value;
    String unit;

    SensorData()
        : id(0), uid(0), sid(0), value(0.0), unit("") {}

    SensorData(int64_t id_, int64_t uid_, int64_t sid_, double value_, const String &unit_)
        : id(id_), uid(uid_), sid(sid_), value(value_), unit(unit_) {}

    String toJson() const {
        StaticJsonDocument<200> doc;
        doc["id"] = id;
        doc["uid"] = uid;
        doc["sid"] = sid;
        doc["value"] = value;
        doc["unit"] = unit;
        String out;
        serializeJson(doc, out);
        return out;
    }

    static SensorData fromJson(const String &json) {
        StaticJsonDocument<200> doc;
        deserializeJson(doc, json);
        SensorData sd;
        sd.id = doc["id"] | 0;
        sd.uid = doc["uid"] | 0;
        sd.sid = doc["sid"] | 0;
        sd.value = doc["value"] | 0.0;
        sd.unit = doc["unit"] | "";
        return sd;
    }
};
