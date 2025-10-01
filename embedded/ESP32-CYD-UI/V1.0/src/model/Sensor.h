#pragma once

#include <WString.h>
#include <ArduinoJson.h>

struct Sensor {
    int64_t id;
    int64_t uid;
    int64_t mid;
    int64_t did;
    String name;
    String type;   // "digitalSensor", "analogSensor"
    int port;
    bool status;   // Online/Offline
    int runningTime;

    Sensor()
        : id(0), uid(0), mid(0), did(0),
          name(""), type(""), port(0), status(false), runningTime(0) {}

    Sensor(int64_t id_, int64_t uid_, int64_t mid_, int64_t did_,
           const String &name_, const String &type_,
           int port_, bool status_, int runningTime_)
        : id(id_), uid(uid_), mid(mid_), did(did_),
          name(name_), type(type_), port(port_),
          status(status_), runningTime(runningTime_) {}

    String toJson() const {
        StaticJsonDocument<400> doc;
        doc["id"] = id;
        doc["uid"] = uid;
        doc["mid"] = mid;
        doc["did"] = did;
        doc["name"] = name;
        doc["type"] = type;
        doc["port"] = port;
        doc["status"] = status;
        doc["runningTime"] = runningTime;
        String out;
        serializeJson(doc, out);
        return out;
    }

    static Sensor fromJson(const String &json) {
        StaticJsonDocument<400> doc;
        deserializeJson(doc, json);
        Sensor s;
        s.id = doc["id"] | 0;
        s.uid = doc["uid"] | 0;
        s.mid = doc["mid"] | 0;
        s.did = doc["did"] | 0;
        s.name = doc["name"] | "";
        s.type = doc["type"] | "";
        s.port = doc["port"] | 0;
        s.status = doc["status"] | false;
        s.runningTime = doc["runningTime"] | 0;
        return s;
    }
};
