package service

import (
	"encoding/json"
	"log"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
)

type WebSocketService interface {
	SendMessage(uid string, message model.WSMessage) error
	CloseClient(uid string, client realtime.Client) error
}

type webSocketService struct {
	manager *realtime.Manager
}

func NewWebSocketService(manager *realtime.Manager) WebSocketService {
	return &webSocketService{manager: manager}
}

func (s *webSocketService) SendMessage(uid string, message model.WSMessage) error {
	msgBytes, err := json.Marshal(message)
	if err != nil {
		log.Printf("Error marshaling WebSocket message: %v", err)
		return err
	}

	s.manager.BroadcastToUser(uid, msgBytes)
	return nil
}

func (s *webSocketService) CloseClient(uid string, client realtime.Client) error {
	s.manager.RemoveClient(uid, client)

	if err := client.Close(); err != nil {
		log.Printf("Error closing WebSocket client: %v", err)
		return err
	}

	return nil
}
