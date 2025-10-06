package notification

import (
	"encoding/json"
	"time"
)

type NotificationDB struct {
	ID        int64           `gorm:"column:id;primaryKey;autoIncrement"`
	UID       int64           `gorm:"column:uid;not null"`
	Type      string          `gorm:"column:type;not null"`
	Message   string          `gorm:"column:message;not null"`
	Metadata  json.RawMessage `gorm:"column:metadata;not null"`
	IsRead    bool            `gorm:"column:is_read;default:false;not null"`
	CreatedAt time.Time       `gorm:"column:created_at;default:CURRENT_TIMESTAMP;not null"`
}

func (NotificationDB) TableName() string {
	return "tbl_notification"
}

type GetListRequest struct {
	Page  int    `json:"page"`
	Limit int    `json:"limit"`
	Order string `json:"order"`
}

type GetListResponse struct {
	Total int64             `json:"total"`
	List  []*NotificationDB `json:"list"`
}
