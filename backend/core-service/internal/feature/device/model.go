package device

import (
	"encoding/json"
	"time"
)

type DeviceDB struct {
	ID          int64           `gorm:"column:id;primaryKey;autoIncrement"`
	UID         int64           `gorm:"column:uid;not null"`
	MID         int64           `gorm:"column:mid;not null"`
	RID         int64           `gorm:"column:rid;not null"`
	Name        string          `gorm:"column:name;type:varchar(255)"`
	Type        string          `gorm:"column:type;type:varchar(255)"`
	Port        int             `gorm:"column:port"`
	PortLabel   string          `gorm:"-" json:"port_label"`
	Status      bool            `gorm:"column:status"`
	Data        json.RawMessage `gorm:"column:data;type:jsonb"`
	RunningTime int             `gorm:"column:running_time;default:0"`
	CreatedAt   time.Time       `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt   time.Time       `gorm:"column:updated_at;autoUpdateTime"`
}

func (DeviceDB) TableName() string {
	return "tbl_device"
}

func (d *DeviceDB) SetPortLabel() {
	if d.Port >= 14 && d.Port <= 19 {
		d.PortLabel = "A" + string(rune('0'+(d.Port-14)))
	} else {
		if d.Port < 10 {
			d.PortLabel = string(rune('0' + d.Port))
		} else {
			d.PortLabel = string(rune('0'+d.Port/10)) + string(rune('0'+d.Port%10))
		}
	}
}

type CreateDeviceRequest struct {
	RID  int64  `json:"rid"`
	Name string `json:"name"`
	Type string `json:"type"`
	Port int    `json:"port"`
}

type UpdateDeviceRequest struct {
	ID   int64  `json:"id"`
	RID  int64  `json:"rid,omitempty"`
	Name string `json:"name,omitempty"`
	Type string `json:"type,omitempty"`
	Port int    `json:"port,omitempty"`
}

type MQTTGetDeviceData struct {
	ID     int64           `json:"id"`
	Name   string          `json:"name"`
	Type   string          `json:"type"`
	Port   int             `json:"port"`
	Status bool            `json:"status"`
	Data   json.RawMessage `json:"data"`
}
