package model

import "github.com/gorilla/websocket"

type WSClient struct {
	UID  string
	Conn *websocket.Conn
	Send chan []byte
}

type WSMessage struct {
	Type        string      `json:"type"` // control, firmware, hardware...
	UID         string      `json:"uid"`
	MID         string      `json:"mid"`
	Data        interface{} `json:"data"`
	Information interface{} `json:"information,omitempty"`
}

type PendingAction struct {
	UID      int    `json:"user_id"`
	MID      int    `json:"mcu_id"`
	Action   string `json:"action"`
	Payload  string `json:"payload"`
	Status   string `json:"status"`
	Response string `json:"feedback"`
}
