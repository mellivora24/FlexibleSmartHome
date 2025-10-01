#pragma once

#include <WString.h>
#include <ArduinoJson.h>

struct Notification {
    int64_t id;
    int64_t uid;
    String type;
    String message;
    String metadata;
    bool isRead;

    Notification()
        : id(0), uid(0), type(""), message(""), metadata(""), isRead(false) {}

    Notification(int64_t id_, int64_t uid_, const String &type_,
                 const String &message_, const String &metadata_, bool isRead_)
        : id(id_), uid(uid_), type(type_), message(message_), metadata(metadata_), isRead(isRead_) {}

    String toJson() const {
        StaticJsonDocument<512> doc;
        doc["id"] = id;
        doc["uid"] = uid;
        doc["type"] = type;
        doc["message"] = message;
        doc["metadata"] = metadata;
        doc["isRead"] = isRead;
        String out;
        serializeJson(doc, out);
        return out;
    }

    static Notification fromJson(const String &json) {
        StaticJsonDocument<512> doc;
        deserializeJson(doc, json);
        Notification n;
        n.id = doc["id"] | 0;
        n.uid = doc["uid"] | 0;
        n.type = doc["type"] | "";
        n.message = doc["message"] | "";
        n.metadata = doc["metadata"] | "";
        n.isRead = doc["isRead"] | false;
        return n;
    }
};
