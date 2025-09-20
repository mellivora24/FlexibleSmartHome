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

type GetListRequest struct {
	UID       int64     `form:"uid"`
	Page      int       `form:"page"`
	Limit     int       `form:"limit"`
	SortBy    string    `form:"sort_by"`
	SortType  string    `form:"sort_type"`
	Action    string    `form:"action"`
	DID       int64     `form:"did"`
	StartTime time.Time `form:"start_time" time_format:"2006-01-02 15:04:05"`
	EndTime   time.Time `form:"end_time" time_format:"2006-01-02 15:04:05"`
}

type GetOneRequest struct {
	ID     int64     `form:"id"`
	UID    int64     `form:"uid"`
	DID    int64     `form:"did"`
	Action string    `form:"action"`
	AtTime time.Time `form:"at_time" time_format:"2006-01-02 15:04:05"`
}
