package service

import (
	mqtt "github.com/eclipse/paho.mqtt.golang"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

type MQTTService interface {
	GetClient() mqtt.Client
	Publish(topic string, payload interface{}) error
	Subscribe(topic string, handler mqtt.MessageHandler) error
	GetConfigTopic() string
	GetFirmwareTopic() string
	GetDataTopic() string
	GetControlTopic() string
	GetControlResponseTopic() string
}

type mqttService struct {
	client mqtt.Client
	config shared.MQTT_CONFIG
}

func NewMQTTService(client mqtt.Client, config shared.MQTT_CONFIG) MQTTService {
	return &mqttService{
		client: client,
		config: config,
	}
}

func (s *mqttService) Subscribe(topic string, handler mqtt.MessageHandler) error {
	token := s.client.Subscribe(topic, 0, handler)
	token.Wait()
	return token.Error()
}

func (s *mqttService) Publish(topic string, payload interface{}) error {
	token := s.client.Publish(topic, 0, false, payload)
	token.Wait()
	return token.Error()
}

func (s *mqttService) GetClient() mqtt.Client {
	return s.client
}

func (s *mqttService) GetConfigTopic() string {
	return s.config.CONFIG_TOPIC
}

func (s *mqttService) GetFirmwareTopic() string {
	return s.config.FIRMWARE_TOPIC
}

func (s *mqttService) GetDataTopic() string {
	return s.config.DATA_TOPIC
}

func (s *mqttService) GetControlTopic() string {
	return s.config.CONTROL_TOPIC
}

func (s *mqttService) GetControlResponseTopic() string {
	return s.config.CONTROL_RESPONSE_TOPIC
}
