#!/bin/sh
set -e

if [ ! -f /mosquitto/config/passwd ]; then
  mosquitto_passwd -b -c /mosquitto/config/passwd "$MQTT_BROKER_USER" "$MQTT_BROKER_PASS"
  chown mosquitto:mosquitto /mosquitto/config/passwd
fi

exec mosquitto -c /mosquitto/config/mosquitto.conf
