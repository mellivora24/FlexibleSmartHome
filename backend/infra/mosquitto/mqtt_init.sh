#!/bin/sh
set -e

PASSWD_FILE=/mosquitto/config/passwd

if [ -n "$MQTT_BROKER_USER" ] && [ -n "$MQTT_BROKER_PASS" ]; then
  mosquitto_passwd -b -c "$PASSWD_FILE" "$MQTT_BROKER_USER" "$MQTT_BROKER_PASS"
  chown mosquitto:mosquitto "$PASSWD_FILE"
fi

ls /mosquitto/config

exec mosquitto -c /mosquitto/config/mosquitto.conf
