package service

import (
	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MQTTService interface {
	Subscribe(topic string, handler mqtt.MessageHandler) error
	Publish(topic string, payload []byte) error
}

type mqttService struct {
	client mqtt.Client
}

func NewMQTTService(client mqtt.Client) MQTTService {
	return &mqttService{client: client}
}

func (s *mqttService) Subscribe(topic string, handler mqtt.MessageHandler) error {
	token := s.client.Subscribe(topic, 0, handler)
	token.Wait()
	return token.Error()
}

func (s *mqttService) Publish(topic string, payload []byte) error {
	token := s.client.Publish(topic, 0, false, payload)
	token.Wait()
	return token.Error()
}
