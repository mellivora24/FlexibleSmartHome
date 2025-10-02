package model

type WSMessage struct {
	Topic   string      `json:"topic"`
	Payload interface{} `json:"payload"`
}

type WSDeviceControl struct {
	DID     string `json:"did"`
	Command string `json:"command"`
	Value   string `json:"value"`
}

type WSDeviceControlStatus struct {
	Command interface{} `json:"command"`
	Status  string      `json:"status"`
}
