package model

import (
	"encoding/json"
	"time"
)

type UserDB struct {
	ID           int64     `db:"id" json:"id"`
	Name         string    `db:"name" json:"name"`
	Email        string    `db:"email" json:"email"`
	HashPassword string    `db:"hash_password" json:"-"` // không trả ra API
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
}

type ActionDB struct {
	ID        int64           `db:"id" json:"id"`
	UID       int64           `db:"uid" json:"uid"`
	Type      string          `db:"type" json:"type"`
	Data      json.RawMessage `db:"data" json:"data"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
}
