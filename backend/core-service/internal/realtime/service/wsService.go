package service

import (
	"encoding/json"
	"log"
	"sync"

	ws "github.com/gorilla/websocket"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
)

type WebSocketService interface {
	RemoveClient(client model.Client)
	AddClient(uid string, mid string, conn *ws.Conn) model.Client
	SendRawToUser(uid string, data []byte)
	BroadcastToUser(uid string, message model.WSMessage) error
	HandleClientWrite(client model.Client)
	HandleClientRead(client model.Client, mqttService MQTTService)
}

type wsService struct {
	mu      sync.RWMutex
	clients map[string][]model.Client
	//coreService CoreService
}

func NewWebSocketService() WebSocketService {
	return &wsService{
		clients: make(map[string][]model.Client),
		//coreService: service,
	}
}

func (s *wsService) AddClient(uid string, mid string, conn *ws.Conn) model.Client {
	s.mu.Lock()
	defer s.mu.Unlock()

	client := model.NewWSClient(uid, mid, conn)
	s.clients[uid] = append(s.clients[uid], client)

	log.Printf("[WSService] Client added UID=%s MID=%s (total: %d)", uid, mid, len(s.clients[uid]))
	return client
}

func (s *wsService) RemoveClient(client model.Client) {
	s.mu.Lock()
	defer s.mu.Unlock()

	uid := client.GetUID()
	clients := s.clients[uid]

	for i, c := range clients {
		if c == client {
			s.clients[uid] = append(clients[:i], clients[i+1:]...)
			break
		}
	}

	if len(s.clients[uid]) == 0 {
		delete(s.clients, uid)
		log.Printf("[WSService] All clients removed UID=%s", uid)
	} else {
		log.Printf("[WSService] Client removed UID=%s (remaining: %d)", uid, len(s.clients[uid]))
	}

	if err := client.Close(); err != nil {
		log.Printf("[WSService] Error closing client conn: %v", err)
	}
}

func (s *wsService) BroadcastToUser(uid string, message model.WSMessage) error {
	msgBytes, err := json.Marshal(message)
	if err != nil {
		log.Printf("[WSService] Marshal error: %v", err)
		return err
	}
	s.SendRawToUser(uid, msgBytes)
	return nil
}

func (s *wsService) SendRawToUser(uid string, data []byte) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	clients, ok := s.clients[uid]
	if !ok {
		log.Printf("[WSService] No clients UID=%s", uid)
		return
	}

	log.Printf("[WSService] Sending to %d clients UID=%s", len(clients), uid)

	for _, client := range clients {
		go func(c model.Client) {
			if err := c.Send(data); err != nil {
				log.Printf("[WSService] Send error: %v", err)
			}
		}(client)
	}
}

func (s *wsService) HandleClientWrite(client model.Client) {
	wsClient, ok := client.(*model.WSClient)
	if !ok {
		log.Println("[WSService] Invalid client type in write")
		return
	}

	for msg := range wsClient.GetSendChannel() {
		if err := wsClient.GetConn().WriteMessage(ws.TextMessage, msg); err != nil {
			log.Printf("[WSService] Write error: %v", err)
			return
		}
	}
}

func (s *wsService) HandleClientRead(client model.Client, mqttService MQTTService) {
	wsClient, ok := client.(*model.WSClient)
	if !ok {
		log.Println("[WSService] Invalid client type in read")
		return
	}

	defer s.RemoveClient(client)

	for {
		_, message, err := wsClient.GetConn().ReadMessage()
		if err != nil {
			if ws.IsUnexpectedCloseError(err, ws.CloseGoingAway, ws.CloseAbnormalClosure) {
				log.Printf("[WSService] Unexpected close: %v", err)
			}
			break
		}

		var msg model.WSMessage
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("[WSService] Invalid WSMessage: %v", err)
		}

		if msg.Topic == "control" {
			s.handleControlCommand(client, msg, mqttService)
		}
	}
}

func (s *wsService) handleControlCommand(client model.Client, msg model.WSMessage, mqttService MQTTService) {
	topic := "user/" + client.GetUID() + "/mcu/" + client.GetMID() + "/control"
	payload, err := json.Marshal(msg.Payload)
	if err != nil {
		log.Printf("[WSService] Marshal control command error: %v", err)
		return
	}

	//err = s.coreService.CreatePendingAction(client.GetUID(), client.GetMID(), msg)
	//if err != nil {
	//	log.Printf("[WSService] Create pending action error: %v", err)
	//	return
	//}

	if err := mqttService.Publish(topic, payload); err != nil {
		log.Printf("[WSService] MQTT publish error: %v", err)
	}

	action := model.WSDeviceControlStatus{
		Command: msg.Payload,
		Status:  "pending",
	}

	msg = model.WSMessage{
		Topic:   "control",
		Payload: action,
	}

	if err := s.BroadcastToUser(client.GetUID(), msg); err != nil {
		log.Printf("[WSService] Broadcast control pending error: %v", err)
	}
}
