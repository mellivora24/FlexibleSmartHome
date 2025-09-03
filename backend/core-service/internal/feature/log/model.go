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

type GetListRequest struct {
	UID   int64 `json:"uid"`
	Page  int   `json:"page"`
	Limit int   `json:"limit"`
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
