#!/bin/sh
set -e

if [ -n "$MQTT_BROKER_USER" ] && [ -n "$MQTT_BROKER_PASS" ]; then
  mosquitto_passwd -b -c /mosquitto/config/passwd "$MQTT_BROKER_USER" "$MQTT_BROKER_PASS"
fi

exec mosquitto -c /mosquitto/config/mosquitto.conf
