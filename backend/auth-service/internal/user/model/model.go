package model

import (
	"encoding/json"
	"time"
)

type User struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Token string `json:"token"`
}

type CreateRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type UpdateRequest struct {
	ID    int64  `json:"id"` // URL param
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UpdateResponse struct {
	ID    int64  `json:"id"`
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
	Email    string `json:"email"`
	Password string `json:"password"`
}

type DeleteResponse struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	Msg   string `json:"msg"`
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

type ListActionsRequest struct {
	UID int64 `json:"uid"`
}

type ListActionsResponse struct {
	Actions []Action `json:"actions"`
}
