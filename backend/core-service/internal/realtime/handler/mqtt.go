package handler

import (
	"encoding/json"
	"log"
	"strconv"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/sensorData"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
)

type MQTTHandler struct {
	wsService         service.WebSocketService
	mqttService       service.MQTTService
	sensorDataService sensorData.Service
}

func NewMQTTHandler(mqttService service.MQTTService, sensorDataService sensorData.Service, wsService service.WebSocketService) *MQTTHandler {
	log.Print("Creating MQTT handler")

	return &MQTTHandler{
		wsService:   wsService,
		mqttService: mqttService,

		sensorDataService: sensorDataService,
	}
}

func (h *MQTTHandler) Init() {
	err := h.mqttService.Subscribe("user/+/mcu/+/data", h.onSensorData)
	if err != nil {
		log.Printf("Error subscribing to sensor data topic: %v", err)
		return
	}

	err = h.mqttService.Subscribe("user/+/mcu/+/feedback", h.onControlResponse)
	if err != nil {
		log.Printf("Error subscribing to feedback topic: %v", err)
		return
	}

	// TODO: add logic for other topic
}

func (h *MQTTHandler) onSensorData(client mqtt.Client, msg mqtt.Message) {
	var data model.SensorDataPayload
	if err := json.Unmarshal(msg.Payload(), &data); err != nil {
		log.Printf("Error decoding payload: %v", err)
		return
	}

	uid := extractUIDFromTopic(msg.Topic())
	mid := extractMIDFromTopic(msg.Topic())

	// if err := h.sensorDataService.Create(data.UID, data.SID, data.Value, data.Unit); err != nil {
	// 	log.Printf("Error saving sensor data: %v", err)
	// }

	wsMessage := model.WSMessage{
		Type: "sensor_data",
		UID:  uid,
		MID:  mid,
		Data: data,
		Information: map[string]string{
			"dataSaved": "true",
		},
	}

	if err := h.wsService.SendMessage(wsMessage.UID, wsMessage); err != nil {
		log.Printf("Error broadcasting sensor data to WebSocket: %v", err)
	}
}

func (h *MQTTHandler) onControlResponse(client mqtt.Client, msg mqtt.Message) {
	var feedback model.Feedback
	if err := json.Unmarshal(msg.Payload(), &feedback); err != nil {
		log.Printf("Error decoding feedback payload: %v", err)
		return
	}

	uid := extractUIDFromTopic(msg.Topic())
	wsMessage := model.WSMessage{
		Type: "feedback",
		UID:  uid,
		MID:  strconv.Itoa(feedback.MID),
		Data: feedback,
	}

	// TODO: save Action to EventDB

	if err := h.wsService.SendMessage(uid, wsMessage); err != nil {
		log.Printf("Error broadcasting feedback to WebSocket: %v", err)
	}
}

// TODO: handler other topic here

func extractUIDFromTopic(topic string) string {
	parts := strings.Split(topic, "/")
	if len(parts) >= 2 {
		return parts[1]
	}
	return ""
}

func extractMIDFromTopic(topic string) string {
	parts := strings.Split(topic, "/")
	if len(parts) >= 4 {
		return parts[3]
	}
	return ""
}
