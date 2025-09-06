package user

import (
	"encoding/json"
	"time"
)

type UserDB struct {
	ID           int64     `gorm:"column:id;primaryKey;autoIncrement"`
	MID          int64     `gorm:"column:mid;not null"`
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

type User struct {
	ID        int64     `json:"id"`
	MID       int64     `json:"mid"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateRequest struct {
	MID      int64  `json:"mid"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateResponse struct {
	ID        int64     `json:"id"`
	MID       int64     `json:"mid"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Token     string    `json:"token"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID    int64  `json:"id"`
	MID   int64  `json:"mid"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Token string `json:"token"`
}

type UpdateRequest struct {
	ID    int64  `json:"id"`
	MID   int64  `json:"mid"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UpdateResponse struct {
	ID    int64  `json:"id"`
	MID   int64  `json:"mid"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type GetRequest struct {
	ID int64 `json:"id"`
}

type GetResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type DeleteRequest struct {
	Email string `json:"email"`
}

type DeleteResponse struct {
	MSG string `json:"status"`
}

type Action struct {
	ID        int64           `json:"id"`
	UID       int64           `json:"uid"`
	Type      string          `json:"type"`
	Data      json.RawMessage `json:"data"`
	CreatedAt time.Time       `json:"created_at"`
}

type ActionCreate struct {
	UID  int64           `json:"uid"`
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type ActionCreateResponse struct {
	ID       int64     `json:"id"`
	CreateAt time.Time `json:"create_at"`
}

type ListActionsRequest struct {
	UID int64 `json:"uid"`
}

type ListActionsResponse struct {
	ID        int64           `json:"id"`
	UID       int64           `json:"uid"`
	Type      string          `json:"type"`
	Data      json.RawMessage `json:"data"`
	CreatedAt time.Time       `json:"created_at"`
}

type VerifyTokenResponse struct {
	UID     int64 `json:"uid"`
	MID     int64 `json:"mid"`
	IsValid bool  `json:"valid"`
}
