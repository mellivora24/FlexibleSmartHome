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
	if err := h.mqttService.Subscribe("/health/request", h.onHealthCheck); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe(h.mqttService.GetDataTopic(), h.onSensorData); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe(h.mqttService.GetControlResponseTopic(), h.onControlResp); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("user/+/mcu/+/config/device/request", h.onConfigDeviceRequest); err != nil {
		return err
	}

	if err := h.mqttService.Subscribe("user/+/mcu/+/config/sensor/request", h.onConfigSensorRequest); err != nil {
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

func (h *MQTTHandler) onConfigDeviceRequest(client mqtt.Client, msg mqtt.Message) {
	parts := strings.Split(msg.Topic(), "/")
	if len(parts) < 5 {
		log.Printf("[MQTTHandler] Invalid topic format: %s", msg.Topic())
		return
	}

	uid := parts[1]
	mcuId := parts[3]

	list, err := h.coreService.GetDeviceList(uid)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting device list for uid=%s: %v", uid, err)
		return
	}

	responseData := model.MQTTMessage{
		Topic:   "config",
		Payload: list,
	}

	payload, _ := json.Marshal(responseData)

	responseTopic := "user/" + uid + "/mcu/" + mcuId + "/config/device/response"
	err = h.mqttService.Publish(responseTopic, payload)
	if err != nil {
		log.Printf("[MQTTHandler] Error publishing config response: %v", err)
		return
	}
}

func (h *MQTTHandler) onConfigSensorRequest(client mqtt.Client, msg mqtt.Message) {
	parts := strings.Split(msg.Topic(), "/")
	if len(parts) < 5 {
		log.Printf("[MQTTHandler] Invalid topic format: %s", msg.Topic())
		return
	}

	uid := parts[1]
	mcuId := parts[3]

	list, err := h.coreService.GetSensorList(uid)
	if err != nil {
		log.Printf("[MQTTHandler] Error getting device list for uid=%s: %v", uid, err)
		return
	}

	responseData := model.MQTTMessage{
		Topic:   "config",
		Payload: list,
	}

	payload, _ := json.Marshal(responseData)

	responseTopic := "user/" + uid + "/mcu/" + mcuId + "/config/sensor/response"
	err = h.mqttService.Publish(responseTopic, payload)
	if err != nil {
		log.Printf("[MQTTHandler] Error publishing sensor config response: %v", err)
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
