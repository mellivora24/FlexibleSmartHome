package websocket

import (
	"net/http"

	ws "github.com/gorilla/websocket"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

var upgrader = ws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func InitWS(w http.ResponseWriter, r *http.Request, authCfg shared.AUTH_CONFIG) (*ws.Conn, error) {
	//token := r.URL.Query().Get("token")
	//if token == "" {
	//	http.Error(w, "token required", http.StatusUnauthorized)
	//	return nil, fmt.Errorf("token required")
	//}
	//
	//if !shared.VerifyToken(&authCfg, token) {
	//	http.Error(w, "invalid token", http.StatusUnauthorized)
	//	return nil, fmt.Errorf("invalid token")
	//}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}

	return conn, nil
}
