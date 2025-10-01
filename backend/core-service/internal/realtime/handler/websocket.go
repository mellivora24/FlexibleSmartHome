package handler

import (
	"encoding/json"
	"log"
	"net/http"

	ws "github.com/gorilla/websocket"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/websocket"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
)

type WSClient struct {
	conn *ws.Conn
	send chan []byte
}

func NewWSClient(conn *ws.Conn) *WSClient {
	return &WSClient{
		conn: conn,
		send: make(chan []byte, 256),
	}
}

func (c *WSClient) Send(msg []byte) error {
	c.send <- msg
	return nil
}

func (c *WSClient) Close() error {
	return c.conn.Close()
}

func (c *WSClient) WritePump() {
	defer func() {
		close(c.send)
		if err := c.Close(); err != nil {
			log.Println("Error closing WebSocket client:", err)
		}
	}()

	for msg := range c.send {
		if err := c.conn.WriteMessage(ws.TextMessage, msg); err != nil {
			log.Println("Error writing WebSocket message:", err)
			return
		}
	}
}

func (c *WSClient) ReadPump(mqttService service.MQTTService, wsService service.WebSocketService, uid string) {
	defer func() {
		err := wsService.CloseClient(uid, c)
		if err != nil {
			log.Println("Error closing WebSocket client:", err)
		}
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if ws.IsUnexpectedCloseError(err, ws.CloseGoingAway, ws.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			} else {
				log.Printf("WebSocket closed: %v", err)
			}
			break
		}

		var wsMsg model.WSMessage
		if err := json.Unmarshal(message, &wsMsg); err != nil {
			log.Println("Error decoding WebSocket message:", err)
			continue
		}

		if wsMsg.Type == "control" {
			topic := "user/" + wsMsg.UID + "/mcu/" + wsMsg.MID + "/control"
			payload, err := json.Marshal(wsMsg.Data)
			if err != nil {
				log.Println("Error marshaling control command:", err)
				continue
			}

			if err := mqttService.Publish(topic, payload); err != nil {
				log.Println("Error publishing to MQTT:", err)
				continue
			}
		}
	}
}

func WSHandler(manager *realtime.Manager, mqttService service.MQTTService, wsService service.WebSocketService, w http.ResponseWriter, r *http.Request) {
	uid := r.URL.Query().Get("uid")
	if uid == "" {
		http.Error(w, "Missing uid", http.StatusBadRequest)
		return
	}

	conn, err := websocket.InitWS(w, r)
	if err != nil {
		http.Error(w, "Could not upgrade WebSocket", http.StatusBadRequest)
		return
	}

	client := NewWSClient(conn)
	manager.AddClient(uid, client)
	client.Send([]byte("Connected to WebSocket server"))

	go client.WritePump()
	go client.ReadPump(mqttService, wsService, uid)
}
