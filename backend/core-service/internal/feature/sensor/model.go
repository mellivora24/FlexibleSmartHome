package sensor

import "time"

type SensorDB struct {
	ID          int64     `gorm:"column:id;primaryKey;autoIncrement"`
	UID         int64     `gorm:"column:uid;not null"`
	MID         int64     `gorm:"column:mid"`
	RID         int64     `gorm:"column:rid"`
	Name        string    `gorm:"column:name;type:varchar(255)"`
	Type        string    `gorm:"column:type;type:varchar(255)"`
	Port        int       `gorm:"column:port"`
	Status      bool      `gorm:"column:status"`
	RunningTime int       `gorm:"column:running_time;default:0"`
	CreatedAt   time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt   time.Time `gorm:"column:updated_at;autoUpdateTime"`
}

func (SensorDB) TableName() string {
	return "tbl_sensor"
}

type CreateSensorRequest struct {
	MID  int64  `json:"mid"`
	RID  int64  `json:"rid"`
	Name string `json:"name"`
	Type string `json:"type"`
	Port int    `json:"port"`
}

type UpdateSensorRequest struct {
	ID          int64  `json:"id"`
	MID         int64  `json:"mid,omitempty"`
	RID         int64  `json:"rid,omitempty"`
	Name        string `json:"name,omitempty"`
	Type        string `json:"type,omitempty"`
	Port        int    `json:"port,omitempty"`
	Status      bool   `json:"status,omitempty"`
	RunningTime int    `json:"running_time,omitempty"`
}

type MQTTGetListSensor struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
	Port int    `json:"port"`
}
