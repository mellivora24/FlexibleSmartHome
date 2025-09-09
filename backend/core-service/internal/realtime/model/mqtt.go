package model

type MQTTMessage struct {
	UID     string
	MID     string
	Topic   string
	Payload []byte
	QoS     byte
	Retain  bool
}

type SensorDataPayload struct {
	UID   int64   `json:"uid"`
	SID   int64   `json:"sid"`
	Value float64 `json:"value"`
	Unit  string  `json:"unit"`
}

type Feedback struct {
	MID      int    `json:"mid"`
	ActionID int    `json:"action_id"`
	Success  bool   `json:"success"`
	Message  string `json:"message"`
}
