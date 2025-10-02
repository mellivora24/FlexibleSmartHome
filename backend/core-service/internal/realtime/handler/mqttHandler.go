package handler

import (
	"encoding/json"
	"log"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
)

type MQTTHandler struct {
	mqttService service.MQTTService
	wsService   service.WebSocketService
	coreService service.CoreService
}

func NewMQTTHandler(mqttService service.MQTTService, wsService service.WebSocketService, coreService service.CoreService) *MQTTHandler {
	return &MQTTHandler{
		mqttService: mqttService,
		wsService:   wsService,
		coreService: coreService,
	}
}

func (h *MQTTHandler) Init() error {
	if err := h.mqttService.Subscribe(h.mqttService.GetDataTopic(), h.onSensorData); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe(h.mqttService.GetControlResponseTopic(), h.onControlResp); err != nil {
		return err
	}

	log.Println("[MQTTHandler] Subscribed to topics successfully")
	return nil
}

func (h *MQTTHandler) onSensorData(client mqtt.Client, msg mqtt.Message) {
	uid := extractUIDFromTopic(msg.Topic())

	var data model.MQTTMessage
	if err := json.Unmarshal(msg.Payload(), &data); err != nil {
		log.Printf("Error decoding payload: %v", err)
		return
	}

	err := h.coreService.CreateSensorData(uid, data)
	if err != nil {
		log.Printf("[MQTTHandler] Error creating sensor data for user %s: %v", uid, err)
		return
	}

	wsMessage := model.WSMessage{
		Topic:   "sensor_data",
		Payload: data.Payload,
	}

	err = h.wsService.BroadcastToUser(uid, wsMessage)
	if err != nil {
		log.Printf("[MQTTHandler] Error broadcasting sensor data to user %s: %v", uid, err)
		return
	}
}

func (h *MQTTHandler) onControlResp(client mqtt.Client, msg mqtt.Message) {
	var data model.MQTTMessage
	if err := json.Unmarshal(msg.Payload(), &data); err != nil {
		log.Printf("Error decoding payload: %v", err)
		return
	}

	uid := extractUIDFromTopic(msg.Topic())

	err := h.coreService.CreateEvent(uid, data)
	if err != nil {
		log.Printf("[MQTTHandler] Error creating event: %v", err)
		return
	}
	err = h.coreService.UpdateDeviceStatus(data)
	if err != nil {
		log.Printf("[MQTTHandler] Error updating device status: %v", err)
		return
	}

	wsMessage := model.WSMessage{
		Topic:   "control_response",
		Payload: data.Payload,
	}

	err = h.wsService.BroadcastToUser(uid, wsMessage)
	if err != nil {
		log.Printf("[MQTTHandler] Error broadcasting feedback to user %s: %v", uid, err)
		return
	}
}

func extractUIDFromTopic(topic string) string {
	parts := strings.Split(topic, "/")
	if len(parts) >= 2 {
		return parts[1]
	}
	return ""
}
