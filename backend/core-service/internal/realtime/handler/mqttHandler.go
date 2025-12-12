package handler

import (
	"encoding/json"
	"log"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
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
	if err := h.mqttService.Subscribe("/health/request", h.onHealthCheck); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("mcu/+/data", h.onSensorData); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("mcu/+/control/response", h.onControlResp); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("mcu/+/device/embedded_control", h.onControlResp); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("mcu/+/config/request", h.onConfigDeviceRequest); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("mcu/+/alert", h.onNotify); err != nil {
		return err
	}

	log.Println("[MQTTHandler] Subscribed to topics successfully")
	return nil
}

func (h *MQTTHandler) onHealthCheck(client mqtt.Client, msg mqtt.Message) {
	err := h.mqttService.Publish("/health/response", "ok")
	if err != nil {
		log.Printf("[MQTTHandler] Error while publishing health check response: %v", err)
		return
	}
}

func (h *MQTTHandler) onSensorData(client mqtt.Client, msg mqtt.Message) {
	mcuCode := extractMCUCodeFromTopic(msg.Topic())

	var data model.MQTTMessage
	if err := json.Unmarshal(msg.Payload(), &data); err != nil {
		log.Printf("Error decoding payload: %v", err)
		return
	}

	// Get UID from MCU code via database lookup
	uid, err := h.coreService.GetUIDByMCUCode(mcuCode)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting UID for MCU %s: %v", mcuCode, err)
		return
	}

	err = h.coreService.CreateSensorData(uid, data)
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

	mcuCode := extractMCUCodeFromTopic(msg.Topic())

	uid, err := h.coreService.GetUIDByMCUCode(mcuCode)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting UID for MCU %s: %v", mcuCode, err)
		return
	}

	err = h.coreService.CreateEvent(uid, data)
	if err != nil {
		log.Printf("[MQTTHandler] Error creating event: %v", err)
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

func (h *MQTTHandler) onConfigDeviceRequest(client mqtt.Client, msg mqtt.Message) {
	parts := strings.Split(msg.Topic(), "/")
	if len(parts) < 3 {
		log.Printf("[MQTTHandler] Invalid topic format: %s", msg.Topic())
		return
	}

	// Changed: MCU code is now at index 1 instead of 3
	mcuCode := parts[1]

	// Get UID from MCU code via database lookup
	uid, err := h.coreService.GetUIDByMCUCode(mcuCode)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting UID for MCU %s: %v", mcuCode, err)
		return
	}

	list, err := h.coreService.GetDeviceList(uid, mcuCode)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting device list for uid=%s: %v", uid, err)
		return
	}

	for i := range list {
		list[i].Name = shared.RemoveVietnameseAccents(list[i].Name)
	}

	responseData := model.MQTTMessage{
		Topic:   "config",
		Payload: list,
	}

	payload, _ := json.Marshal(responseData)

	// Changed: Response topic format without user ID
	responseTopic := "mcu/" + mcuCode + "/config/response"
	err = h.mqttService.Publish(responseTopic, payload)
	if err != nil {
		log.Printf("[MQTTHandler] Error publishing config response: %v", err)
		return
	}
}

func (h *MQTTHandler) onNotify(client mqtt.Client, msg mqtt.Message) {
	mcuCode := extractMCUCodeFromTopic(msg.Topic())

	var message model.MQTTMessage
	if err := json.Unmarshal(msg.Payload(), &message); err != nil {
		log.Printf("Error decoding payload: %v", err)
		return
	}

	var alert model.MQTTAlert
	alertBytes, _ := json.Marshal(message.Payload)
	if err := json.Unmarshal(alertBytes, &alert); err != nil {
		log.Printf("Error decoding alert payload: %v", err)
		return
	}

	uid, err := h.coreService.GetUIDByMCUCode(mcuCode)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting UID for MCU %s: %v", mcuCode, err)
		return
	}

	wsMessage := model.WSMessage{
		Topic:   "alert",
		Payload: alert,
	}

	err = h.wsService.BroadcastToUser(uid, wsMessage)
	if err != nil {
		log.Printf("[MQTTHandler] Error broadcasting alert to user %s: %v", uid, err)
		return
	}

	err = h.coreService.CreateNotification(uid, mcuCode, alert.Title, alert.Message)
	if err != nil {
		log.Printf("[MQTTHandler] Error creating alert for user %s: %v", uid, err)
		return
	}
}

func extractMCUCodeFromTopic(topic string) string {
	parts := strings.Split(topic, "/")
	if len(parts) >= 2 {
		return parts[1]
	}
	return ""
}
