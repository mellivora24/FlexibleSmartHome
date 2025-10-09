package sensorData

import "time"

type SensorDataDB struct {
	ID        int64     `gorm:"column:id;primaryKey;autoIncrement"`
	UID       int64     `gorm:"column:uid;not null"`
	DID       int64     `gorm:"column:did;not null"`
	Value     float64   `gorm:"column:value;not null"`
	Unit      string    `gorm:"column:unit;not null"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (SensorDataDB) TableName() string {
	return "tbl_sensor_data"
}

type SensorDataItem struct {
	ID         int64     `json:"id" gorm:"column:id"`
	DID        int64     `json:"did" gorm:"column:did"`
	SensorName string    `json:"sensorName" gorm:"column:sensor_name"`
	Value      float64   `json:"value" gorm:"column:value"`
	Unit       string    `json:"unit" gorm:"column:unit"`
	CreatedAt  time.Time `json:"createdAt" gorm:"column:created_at"`
}

type GetListResponse struct {
	Total int64            `json:"total"`
	List  []SensorDataItem `json:"list"`
}

type GetListRequest struct {
	DID       int64     `form:"did"`
	Name      string    `form:"name"`
	Value     float64   `form:"value"`
	Time      time.Time `form:"time" time_format:"2006-01-02 15:04:05"`
	Page      int       `form:"page"`
	Limit     int       `form:"limit"`
	SortBy    string    `form:"sort_by"`
	SortType  string    `form:"sort_type"`
	StartTime time.Time `form:"start_time" time_format:"2006-01-02 15:04:05"`
	EndTime   time.Time `form:"end_time" time_format:"2006-01-02 15:04:05"`
}

type GetOneRequest struct {
	ID     int64     `form:"id"`
	DID    int64     `form:"did"`
	Value  float64   `form:"value"`
	AtTime time.Time `form:"at_time" time_format:"2006-01-02 15:04:05"`
}
