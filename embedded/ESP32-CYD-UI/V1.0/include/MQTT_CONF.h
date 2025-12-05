#define MQTT_PORT     1883
#define MQTT_PASS     "13M09Q24T"
#define MQTT_USER     "core-service"
#define MQTT_SERVER   "172.20.10.11"
#define MQTT_CLIENT_ID    "EmbeddedDevice_001"

#define USER_ID           "1"
#define MCU_CODE          "123456"

#define MQTT_TOPIC_HEALTH_REQ                 "/health/request"
#define MQTT_TOPIC_HEALTH_RESP                "/health/response"

#define MQTT_TOPIC_BASE(userId, mcuCode)      "user/" userId "/mcu/" mcuCode

#define MQTT_TOPIC_DATA(userId, mcuCode)      MQTT_TOPIC_BASE(userId, mcuCode) "/data"
#define MQTT_TOPIC_ALERT(userId, mcuCode)     MQTT_TOPIC_BASE(userId, mcuCode) "/alert"
#define MQTT_TOPIC_CONFIG_REQ(userId, mcuCode)   MQTT_TOPIC_BASE(userId, mcuCode) "/config/request"
#define MQTT_TOPIC_CONFIG_RESP(userId, mcuCode)  MQTT_TOPIC_BASE(userId, mcuCode) "/config/response"
#define MQTT_TOPIC_CONTROL_REQ(userId, mcuCode)   MQTT_TOPIC_BASE(userId, mcuCode) "/control/request"
#define MQTT_TOPIC_CONTROL_RESP(userId, mcuCode) MQTT_TOPIC_BASE(userId, mcuCode) "/control/response"
#define MQTT_TOPIC_EMBEDDED_CONTROL(userId, mcuCode)    MQTT_TOPIC_BASE(userId, mcuCode) "/device/embedded_control"


#define MQTT_TOPIC_SUB_HEALTH_REQ    MQTT_TOPIC_HEALTH_REQ
#define MQTT_TOPIC_PUB_DATA          MQTT_TOPIC_DATA(USER_ID, MCU_CODE)
#define MQTT_TOPIC_PUB_ALERT         MQTT_TOPIC_ALERT(USER_ID, MCU_CODE)
#define MQTT_TOPIC_SUB_CONFIG_REQ    MQTT_TOPIC_CONFIG_REQ(USER_ID, MCU_CODE)
#define MQTT_TOPIC_PUB_CONFIG_RESP   MQTT_TOPIC_CONFIG_RESP(USER_ID, MCU_CODE)
#define MQTT_TOPIC_SUB_CONTROL_REQ   MQTT_TOPIC_CONTROL_REQ(USER_ID, MCU_CODE)
#define MQTT_TOPIC_PUB_CONTROL_RESP  MQTT_TOPIC_CONTROL_RESP(USER_ID, MCU_CODE)
#define MQTT_TOPIC_EMBEDDED_CONTROL_SEND  MQTT_TOPIC_EMBEDDED_CONTROL(USER_ID, MCU_CODE)
