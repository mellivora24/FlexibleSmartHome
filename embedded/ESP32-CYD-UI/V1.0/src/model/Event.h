#pragma once
#include <WString.h>
#include <ArduinoJson.h>

struct Event {
    int64_t id;
    int64_t uid;
    int64_t did;
    String action;
    String payload;

    Event() : id(0), uid(0), did(0), action(""), payload("") {}
    Event(int64_t id_, int64_t uid_, int64_t did_, const String &action_, const String &payload_) : id(id_), uid(uid_), did(did_), action(action_), payload(payload_) {}

    String toJson() const {
        StaticJsonDocument<300> doc;

        doc["id"] = id;
        doc["uid"] = uid;
        doc["did"] = did;
        doc["action"] = action;
        doc["payload"] = payload;

        String out;
        serializeJson(doc, out);
        return out;
    }

    static Event fromJson(const String &json) {
        StaticJsonDocument<300> doc;
        DeserializationError err = deserializeJson(doc, json);
        Event e;

        if (!err) {
            e.id = doc["id"] | 0;
            e.uid = doc["uid"] | 0;
            e.did = doc["did"] | 0;
            e.action = doc["action"] | "";
            e.payload = doc["payload"] | "";
        }
        
        return e;
    }
};
