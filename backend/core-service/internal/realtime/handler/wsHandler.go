package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/websocket"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
)

func WSHandler(wsService service.WebSocketService, mqttService service.MQTTService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid := r.URL.Query().Get("uid")
		mid := r.URL.Query().Get("mid")

		if uid == "" || mid == "" {
			http.Error(w, "Missing uid or mid parameter", http.StatusBadRequest)
			return
		}

		conn, err := websocket.InitWS(w, r)
		if err != nil {
			http.Error(w, "Could not upgrade to WebSocket", http.StatusBadRequest)
			return
		}

		client := wsService.AddClient(uid, mid, conn)

		welcomeMessage := model.WSMessage{
			Topic:   "connect",
			Payload: json.RawMessage("{\"status\": \"connected\"}"),
		}

		preData, err := json.Marshal(welcomeMessage)
		if err != nil {
			return
		}

		err = client.Send(preData)
		if err != nil {
			return
		}

		log.Printf("[WSHandler] New client connected: UID=%s", uid)

		go wsService.HandleClientWrite(client)
		wsService.HandleClientRead(client, mqttService)
	}
}
