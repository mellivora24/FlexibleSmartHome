#define MQTT_PORT     1883
#define MQTT_PASS     "13M09Q24T"
#define MQTT_USER     "core-service"
#define MQTT_SERVER   "192.168.1.106"
#define MQTT_CLIENT_ID    "EmbeddedDevice_001"

#define MCU_CODE          "8888"

#define MQTT_TOPIC_HEALTH_REQ                 "/health/request"
#define MQTT_TOPIC_HEALTH_RESP                "/health/response"

#define MQTT_TOPIC_BASE(mcuCode)      "mcu/" mcuCode

#define MQTT_TOPIC_DATA(mcuCode)      MQTT_TOPIC_BASE(mcuCode) "/data"
#define MQTT_TOPIC_ALERT(mcuCode)     MQTT_TOPIC_BASE(mcuCode) "/alert"
#define MQTT_TOPIC_CONFIG_REQ(mcuCode)   MQTT_TOPIC_BASE(mcuCode) "/config/request"
#define MQTT_TOPIC_CONFIG_RESP(mcuCode)  MQTT_TOPIC_BASE(mcuCode) "/config/response"
#define MQTT_TOPIC_CONTROL_REQ(mcuCode)   MQTT_TOPIC_BASE(mcuCode) "/control/request"
#define MQTT_TOPIC_CONTROL_RESP(mcuCode) MQTT_TOPIC_BASE(mcuCode) "/control/response"
#define MQTT_TOPIC_EMBEDDED_CONTROL(mcuCode)    MQTT_TOPIC_BASE(mcuCode) "/device/embedded_control"


#define MQTT_TOPIC_SUB_HEALTH_REQ    MQTT_TOPIC_HEALTH_REQ
#define MQTT_TOPIC_PUB_DATA          MQTT_TOPIC_DATA(MCU_CODE)
#define MQTT_TOPIC_PUB_ALERT         MQTT_TOPIC_ALERT(MCU_CODE)
#define MQTT_TOPIC_SUB_CONFIG_REQ    MQTT_TOPIC_CONFIG_REQ(MCU_CODE)
#define MQTT_TOPIC_PUB_CONFIG_RESP   MQTT_TOPIC_CONFIG_RESP(MCU_CODE)
#define MQTT_TOPIC_SUB_CONTROL_REQ   MQTT_TOPIC_CONTROL_REQ(MCU_CODE)
#define MQTT_TOPIC_PUB_CONTROL_RESP  MQTT_TOPIC_CONTROL_RESP(MCU_CODE)
#define MQTT_TOPIC_EMBEDDED_CONTROL_SEND  MQTT_TOPIC_EMBEDDED_CONTROL(MCU_CODE)
