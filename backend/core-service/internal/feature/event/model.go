package event

import (
	"encoding/json"
	"time"
)

type EventDB struct {
	ID        int64           `gorm:"column:id;primaryKey;autoIncrement"`
	UID       int64           `gorm:"column:uid;not null;index"`
	DID       int64           `gorm:"column:did;not null;index"`
	Action    string          `gorm:"column:action;not null;index"`
	Payload   json.RawMessage `gorm:"column:payload;not null"`
	CreatedAt time.Time       `gorm:"column:created_at;index"`
}

func (EventDB) TableName() string {
	return "tbl_events"
}

type GetListRequest struct {
	UID   int64 `json:"uid"`
	Page  int   `json:"page"`
	Limit int   `json:"limit"`
}

type GetListResponse struct {
	Total int64      `json:"total"`
	List  []*EventDB `json:"list"`
}

type CreateRequest struct {
	UID     int64           `json:"uid"`
	DID     int64           `json:"did"`
	Action  string          `json:"action"`
	Payload json.RawMessage `json:"payload"`
}
