package main

import (
	"fmt"
	"net/http"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/websocket"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

func main() {
	cfg, err := shared.LoadConfig()
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.InitWS(w, r, cfg.AuthService)
		if err != nil {
			fmt.Println("Upgrade WS failed:", err)
			return
		}
		defer conn.Close()

		for {
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("read error:", err)
				break
			}
			fmt.Println("Received:", string(msg))

			if err := conn.WriteMessage(msgType, msg); err != nil {
				fmt.Println("write error:", err)
				break
			}
		}
	})

	fmt.Println("Server listening at :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
