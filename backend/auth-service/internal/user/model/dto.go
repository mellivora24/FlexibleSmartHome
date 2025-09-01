package model

import (
	"encoding/json"
	"time"
)

type UserDB struct {
	ID           int64     `gorm:"column:id;primaryKey;autoIncrement"`
	Name         string    `gorm:"column:name;size:100;not null"`
	Email        string    `gorm:"column:email;size:255;unique;not null"`
	HashPassword string    `gorm:"column:hash_password;not null"`
	CreatedAt    time.Time `gorm:"column:create_at;autoCreateTime"`
}

func (UserDB) TableName() string {
	return "tbl_user"
}

type ActionDB struct {
	ID        int64           `gorm:"column:id;primaryKey;autoIncrement"`
	UID       int64           `gorm:"column:uid;not null"`
	Type      string          `gorm:"column:type;size:100;not null"`
	Data      json.RawMessage `gorm:"column:data;type:jsonb"`
	CreatedAt time.Time       `gorm:"column:create_at;autoCreateTime"`

	User UserDB `gorm:"foreignKey:UID;references:ID;constraint:OnDelete:CASCADE"`
}

func (ActionDB) TableName() string {
	return "tbl_useraction"
}
