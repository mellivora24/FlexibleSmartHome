package sensorData

import "time"

type SensorDataDB struct {
	ID        int64     `gorm:"column:id;primaryKey;autoIncrement"`
	UID       int64     `gorm:"column:uid;not null"`
	SID       int64     `gorm:"column:sid;not null"`
	Value     float64   `gorm:"column:value;not null"`
	Unit      string    `gorm:"column:unit;not null"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (SensorDataDB) TableName() string {
	return "tbl_sensordata"
}

type GetListResponse struct {
	ID         int64     `json:"id"`
	SensorName string    `json:"sensorName"`
	Value      float64   `json:"value"`
	Unit       string    `json:"unit"`
	CreatedAt  time.Time `json:"createdAt"`
}
