package device

import (
	"encoding/json"
	"time"
)

type DeviceDB struct {
	ID          int64           `json:"id"`
	UID         int64           `json:"uid"`
	MID         int64           `json:"mid"`
	RID         int64           `json:"rid"`
	Name        string          `json:"name"`
	Type        string          `json:"type"`
	Port        int             `json:"port"`
	Status      bool            `json:"status"`
	Data        json.RawMessage `json:"data"`
	RunningTime int             `json:"running_time"`
	CreatedAt   time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
}

type DeviceData struct {
	Type  string `json:"type"`
	Value string `json:"value"`
	IsPWM bool   `json:"is_pwm"`
	PWM   int    `json:"pwm"`
}

func (DeviceDB) TableName() string {
	return "tbl_device"
}

type ListDeviceRequest struct {
	UID int `json:"uid"`
	RID int `json:"rid"`
}

type CreateDeviceRequest struct {
	UID  int64  `json:"uid"`
	MID  int64  `json:"mid"`
	RID  int64  `json:"rid"`
	Name string `json:"name"`
	Type string `json:"type"`
	Port int    `json:"port"`
}

type UpdateDeviceRequest struct {
	ID          int64           `json:"id"`
	UID         int64           `json:"uid,omitempty"`
	MID         int64           `json:"mid,omitempty"`
	RID         int64           `json:"rid,omitempty"`
	Name        string          `json:"name,omitempty"`
	Type        string          `json:"type,omitempty"`
	Port        int             `json:"port,omitempty"`
	Status      bool            `json:"status,omitempty"`
	Data        json.RawMessage `json:"data,omitempty"`
	RunningTime int             `json:"running_time,omitempty"`
}
