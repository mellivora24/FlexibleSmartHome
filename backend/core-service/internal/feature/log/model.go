package log

import (
	"encoding/json"
	"time"
)

type LogDB struct {
	ID        int64           `gorm:"column:id;primaryKey;autoIncrement"`
	UID       int64           `gorm:"column:uid;not null"`
	Level     string          `gorm:"column:level;not null"`
	Message   string          `gorm:"column:message;not null"`
	Metadata  json.RawMessage `gorm:"column:metadata;not null"`
	CreatedAt time.Time       `gorm:"column:created_at;autoCreateTime;not null"`
}

func (LogDB) TableName() string {
	return "tbl_log"
}

type GetListResponse struct {
	Total int64    `json:"total"`
	List  []*LogDB `json:"list"`
}

type CreateRequest struct {
	UID      int64           `json:"uid"`
	Level    string          `json:"level"`
	Message  string          `json:"message"`
	Metadata json.RawMessage `json:"metadata"`
}

type GetListRequest struct {
	Page      int       `form:"page"`
	Limit     int       `form:"limit"`
	SortBy    string    `form:"sort_by"`
	SortType  string    `form:"sort_type"`
	Level     string    `form:"level"`
	StartTime time.Time `form:"start_time" time_format:"2006-01-02 15:04:05"`
	EndTime   time.Time `form:"end_time" time_format:"2006-01-02 15:04:05"`
}

type GetOneRequest struct {
	ID     int64     `form:"id"`
	Level  string    `form:"level"`
	AtTime time.Time `form:"at_time" time_format:"2006-01-02 15:04:05"`
}
