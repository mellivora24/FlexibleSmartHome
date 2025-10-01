#pragma once

#include <WString.h>
#include <ArduinoJson.h>
struct Log {
    int64_t id;
    int64_t uid;
    String level;
    String message;
    String metadata;

    Log() : id(0), uid(0), level(""), message(""), metadata("") {}
    Log(int64_t id_, int64_t uid_, const String &level_, const String &message_, const String &metadata_)
        : id(id_), uid(uid_), level(level_), message(message_), metadata(metadata_) {}

    String toJson() const {
        StaticJsonDocument<400> doc;
        doc["id"] = id;
        doc["uid"] = uid;
        doc["level"] = level;
        doc["message"] = message;
        doc["metadata"] = metadata;

        String out;
        serializeJson(doc, out);
        return out;
    }

    static Log fromJson(const String &json) {
        StaticJsonDocument<400> doc;
        DeserializationError err = deserializeJson(doc, json);
        Log l;

        if (!err) {
            l.id = doc["id"] | 0;
            l.uid = doc["uid"] | 0;
            l.level = doc["level"] | "";
            l.message = doc["message"] | "";
            l.metadata = doc["metadata"] | "";
        }
        return l;
    }
};
