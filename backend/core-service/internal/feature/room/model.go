package room

import "time"

type RoomDB struct {
	ID          int64     `gorm:"column:id;primaryKey;autoIncrement"`
	UID         int64     `gorm:"column:uid;not null"`
	Name        string    `gorm:"column:name;not null"`
	Description string    `gorm:"column:description;not null"`
	CreatedAt   time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP;not null"`
}

func (RoomDB) TableName() string {
	return "tbl_room"
}

type GetRequest struct {
	ID  int `json:"id,omitempty"`
	UID int `json:"uid,omitempty"`
}

type CreateRequest struct {
	UID         int    `json:"uid,omitempty"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
}
