package model

type MQTTMessage struct {
	Topic   string      `json:"topic"`
	Payload interface{} `json:"payload"`
}

type MQTTSensorData struct {
	DID   int64   `json:"did"`
	Value float64 `json:"value"`
	Unit  string  `json:"unit"`
}

type MQTTDeviceControlResp struct {
	DID     int64  `json:"did"`
	Command string `json:"command"`
	Value   int64  `json:"value"`
	Status  string `json:"status"`
}

type MQTTFirmwareVersion struct {
	FirmwareVersion string `json:"firmware_version"`
	UpdateAt        string `json:"update_at"`
}
