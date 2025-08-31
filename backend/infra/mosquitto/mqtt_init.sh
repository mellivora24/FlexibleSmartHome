#!/bin/sh
set -e

if [ ! -f "$PASSWD_FILE" ]; then
  mosquitto_passwd -b -c "$PASSWD_FILE" "$MQTT_BROKER_USER" "$MQTT_BROKER_PASS"
  chown mosquitto:mosquitto "$PASSWD_FILE"
fi

exec mosquitto -c /mosquitto/config/mosquitto.conf
